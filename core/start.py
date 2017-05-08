"""
Starting point

Usage:
-c 'config.yml' (config file path)
"""

import sys
import getopt

import yaml

from agents.agent_2048 import Agent2048
from agents.agent_cartpole import AgentCartPole


def main(argv):
    """ parses argument list from user """
    # Default config file
    config_file = 'config.yml'

    try:
        opts, _ = getopt.getopt(argv, 'h:c:')
    except getopt.GetoptError:
        program_quit()

    for opt, arg in opts:
        if opt == '-h':
            program_quit()
        elif opt == '-c':
            config_file = arg

    with open(config_file, 'r') as ymlfile:
        config = yaml.load(ymlfile)
        program_action(config)


def program_action(config):
    ''' invoke ai '''
    game = config['Game']
    play_mode = config['PlayMode']

    if game == '2048':
        if play_mode == 'aiplay':
            pass
        elif play_mode == 'learn':
            ai = Agent2048(config)
            ai.learn()
        else:
            program_quit()
    elif game == 'cartpole':
        if play_mode == 'learn':
            ai = AgentCartPole(config)
            ai.learn()
        else:
            program_quit()
    else:
        program_quit()


def program_quit():
    """ exists program and provides instructions """
    print('Run Instructions:')
    print('run.py '
          '-c <config_file[default=config.yml]> ')
    sys.exit(2)


if __name__ == "__main__":
    main(sys.argv[1:])
