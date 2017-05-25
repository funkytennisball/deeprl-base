''' Base class for all rl agents '''

from abc import ABC, abstractmethod

import math
import random
import operator
from collections import deque

import numpy as np

from redis_manager.redis_manager import RedisManager


class BaseAgent(ABC):
    ''' Base class for agents is an abstract class '''

    def __init__(self, config, redis_key, redis_channel):
        self.config = config
        self.env = None

        self.model = None
        self.input_dim = None
        self.output_dim = None
        self.mode_learn = True

        self.memory = deque(maxlen=self.config['MemoryMaxSize'])
        self.episodes = self.config['Episodes']
        self.discount_rate = self.config['DiscountRate']
        self.batch_size = self.config['BatchSize']
        self.exploration_strategy = self.config['ExplorationStrategy']

        # setup redis connection
        self.redis_mgr = RedisManager(redis_key, redis_channel)

        if self.exploration_strategy == 'softmax':
            assert self.config['ComputationalTemperature'] is not None
            self.temperature = self.config['ComputationalTemperature']
        elif self.exploration_strategy == 'egreedy':
            assert self.config['EpsilonMin'] is not None
            assert self.config['EpsilonDecay'] is not None

            self.epsilon = 1.0
            self.epsilon_min = self.config['EpsilonMin']
            self.epsilon_decay = self.config['EpsilonDecay']
        else:
            raise ValueError('Invalid strategy specified')

        self.learn_itr = 0

    @abstractmethod
    def learn(self):
        ''' base method for the ai to learn a defined game '''
        pass

    def _remember(self, state, action, next_state, reward, game_state):
        """ Stores given state, action, next_state, game_state pair in the memory """
        self.memory.append(
            (state, action, next_state, reward, game_state))

    def _act(self, state, available_moves):
        """ DQN agent will decide on the action given a particular state """
        input_state = np.array([state])
        act_values = self.model.predict(input_state)[0]

        if self.mode_learn:
            if self.exploration_strategy == 'softmax':
                return self._act_softmax(act_values, available_moves)
            elif self.exploration_strategy == 'egreedy':
                return self._act_egreedy(act_values, available_moves)
            else:
                raise ValueError('Invalid strategy specified')
        else:
            move, _ = max([(i, val) for i, val in enumerate(
                act_values) if i in available_moves], key=operator.itemgetter(1))
            return move, act_values

    def _act_softmax(self, act_values, available_moves):
        pow_act_values = [(i, math.exp(val / self.temperature))
                          for i, val in enumerate(act_values)
                          if i in available_moves]
        sum_act_values = sum(act_value for (
            _, act_value) in pow_act_values)
        adj_act_values = [(move, act_value / sum_act_values)
                          for (move, act_value) in pow_act_values]

        rand_sel = random.random()
        cumulative = 0
        for (move, act_value) in adj_act_values:
            cumulative += act_value
            if rand_sel <= cumulative:
                return move, act_values

    def _act_egreedy(self, act_values, available_moves):
        if random.random() <= self.epsilon:
            return random.choice(available_moves), act_values

        return np.argmax(act_values), act_values

    def _update_model(self):
        """ Learns given states in memory set """
        if self.learn_itr < self.batch_size:
            self.learn_itr += 1
            return
        else:
            self.learn_itr = 0

        batch_size = min(len(self.memory), self.batch_size)
        sample = random.sample(self.memory, batch_size)

        X = np.zeros((batch_size, self.input_dim))  # pylint: disable=C0103
        Y = np.zeros((batch_size, self.output_dim))  # pylint: disable=C0103

        for i, (state, action, next_state, score, game_state) in enumerate(sample):
            input_state = np.array([state])
            input_next_state = np.array([next_state])

            target = self.model.predict(input_state)[0]
            reward = self._get_reward(score, game_state)

            target[action] = self._compute_target(
                reward, game_state, input_next_state)

            X[i], Y[i] = input_state, target

        self.model.fit(X, Y, batch_size=batch_size, epochs=1, verbose=0)

        if self.exploration_strategy == 'egreedy':
            if self.epsilon > self.epsilon_min:
                self.epsilon *= self.epsilon_decay

    @abstractmethod
    def _get_reward(self, score, game_state):
        pass

    @abstractmethod
    def _compute_target(self, reward, game_state, input_next_state):
        pass
