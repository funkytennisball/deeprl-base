''' Base Agent wrapper for the game cart pole '''

import copy

from keras.models import Sequential
from keras.layers import Dense
from keras.optimizers import RMSprop

import numpy as np
import gym

from .base_agent import BaseAgent
from redis_manager.redis_keys import RedisKeys


class AgentCartPole(BaseAgent):
    ''' Base agent wrapper for the game cart pole '''

    def __init__(self, config):
        super().__init__(config, RedisKeys.CartPole, RedisKeys.CartPoleChannel)

        self.input_dim = 4
        self.output_dim = 2

        self.env = gym.make('CartPole-v0')

    def learn(self):
        ''' initiates learning for the game 2048 '''
        self._build_model()

        for episode in range(self.episodes):
            # Reset environment
            state = self.env.reset()
            game_end = False
            time_step = 0
            action_space = [i for i in range(self.env.action_space.n)]

            while not game_end:
                action, _ = self._act(state, action_space)
                next_state, reward, game_end, _ = self.env.step(action)

                self._remember(
                    state, action, next_state, reward, game_end)
                state = copy.deepcopy(next_state)

                time_step += 1

                if game_end:
                    print('Episode {:d} finished after {:d} timesteps'.format(
                        episode, time_step))
                    self._update_interface(episode, time_step)

                self._update_model()

    def _update_interface(self, episode, time_step):
        ''' Updates front-end graph view on environment/model changes '''
        self.redis_mgr.update_timestamp(episode, time_step)

        # TODO: refresh rate
        if episode % 10 == 0:
            self.redis_mgr.update_view()

    def _build_model(self):
        """ Builds ANN """
        self.model = Sequential()
        self.model.add(
            Dense(20, input_dim=self.input_dim, activation='tanh'))
        self.model.add(Dense(20, activation='tanh'))
        self.model.add(Dense(self.output_dim, activation='linear'))
        self.model.compile(loss='mse', optimizer=RMSprop(
            lr=self.config['LearningRate']))

    def _get_reward(self, score, _):
        return score

    def _compute_target(self, reward, game_end, input_next_state):
        if not game_end:
            return reward + self.discount_rate * \
                np.amax(self.model.predict(input_next_state)[0])
        else:
            return reward
