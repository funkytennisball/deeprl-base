''' Manager for transactions with Redis '''

import redis


class RedisManager:
    '''
    Manager for transactions with redis
    Data format for a store
    key:timestamp: {
        Episode: Result
    }
    Publishing format
    channel: update
    '''
    TIMESTAMP = 'timestamp'

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
        entry = {keyframe: value}
        key = self.key + ':' + self.TIMESTAMP

        # TODO: Store in config
        self.conn.hmset(key, entry)

    def update_view(self):
        ''' sends pub to redis to alert view of changes '''
        key = self.key + ':' + self.TIMESTAMP

        data = self.conn.hgetall(key)
        self.conn.publish(self.channel, data)
