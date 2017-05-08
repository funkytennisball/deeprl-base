''' Manager for transactions with Redis '''

import redis


class RedisManager:
    '''
    Manager for transactions with redis
    Data format for a store
    key: {
        timestamp: {
            Episode: Result
        }
    }
    Publishing format
    channel: update
    '''
    TIMESTAMP = 'timestamp'
    PUB_MESSAGE = 'update'

    def __init__(self, key, channel):
        self.key = key
        self.channel = channel
        self.conn = redis.Redis('localhost')

        self.reset(key)

    def reset(self, key):
        ''' Clears data stored in db '''
        self.conn.delete(key)

    def update_timestamp(self, keyframe, value):
        ''' Updates timestamp with acquired value '''
        timestamp = self.conn.hmget(self.key, self.TIMESTAMP)

        if timestamp[0] is None:
            entry = {keyframe: value}
        else:
            timestamp[keyframe] = value
            entry = timestamp

        self.conn.hmset(self.key, entry)

    def update_view(self):
        ''' sends pub to redis to alert view of changes '''
        self.conn.publish(self.channel, self.PUB_MESSAGE)
