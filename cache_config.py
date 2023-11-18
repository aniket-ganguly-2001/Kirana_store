from flask_caching import Cache

def make_cache(app):
    app.config.from_mapping({
        "CACHE_TYPE": "RedisCache",
        "CACHE_REDIS_HOST": "localhost",
        "CACHE_REDIS_PORT": 6380
    })

    cache = Cache(app)  
    app.app_context().push()

    return cache