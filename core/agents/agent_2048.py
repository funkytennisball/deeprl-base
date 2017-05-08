''' Base Agent wrapper for the game 2048 '''

import copy

from keras.models import Sequential
from keras.layers import Dense
from keras.optimizers import RMSprop

import numpy as np

from .base_agent import BaseAgent
from environments.game_2048 import Game2048


class Agent2048(BaseAgent):
    ''' Base agent wrapper for the game 2048 '''

    def __init__(self, config):
        super().__init__(config)

        self.input_dim = 16
        self.output_dim = 4

        self.env = Game2048()

    def learn(self):
        ''' initiates learning for the game 2048 '''
        self._build_model()

        for i in range(self.episodes):
            # Resets game
            state, game_state = self.env.reset()

            while game_state != Game2048.GameState.ENDED:
                action_space = self.env.available_moves()
                available_moves = [move.value for move in action_space]

                action, _ = self._act(state, available_moves)
                game_action = Game2048.Action(action)

                next_state, game_state, add_score = self.env.step(game_action)

                if game_state == Game2048.GameState.ENDED:
                    endgame_score = self.env.game_score
                    max_tile = self.env.get_max_tile()

                    self._remember(
                        state, action, next_state, endgame_score, game_state)

                    print('Epsiode: {:d} finished with score {:d} and max tile {:d}'.format(
                        i, endgame_score, max_tile))
                else:
                    self._remember(
                        state, action, next_state, add_score, game_state)

                state = copy.deepcopy(next_state)

                self._update_model()

    def _build_model(self):
        """ Builds ANN """
        self.model = Sequential()
        self.model.add(
            Dense(128, input_dim=self.input_dim, activation='tanh'))
        self.model.add(Dense(128, activation='tanh'))
        self.model.add(Dense(128, activation='tanh'))
        self.model.add(Dense(self.output_dim, activation='linear'))
        self.model.compile(loss='mse', optimizer=RMSprop(
            lr=self.config['LearningRate']))

    def _get_reward(self, score, game_state):
        if game_state == Game2048.GameState.ENDED:
            return score / 1024
        else:
            return 0

    def _compute_target(self, reward, game_state, input_next_state):
        if game_state != Game2048.GameState.ENDED:
            return reward + self.discount_rate * \
                np.amax(self.model.predict(input_next_state)[0])
        else:
            return reward
