# url_shortener
Backend of url_shortener. A service to shorten long urls
# features
- javascript node.js 22 with express 5
- everything is configurable in src/config
- clean architecture
- pm2 
- socketio
- logs: custom json requests logs with morgan and winston (file, console, mongo) with memory (in GB) 
- mongoose
- cluster: configurable in config
- api limiter, helmet, compression
- --max-old-space-size=32000
- prettier before commit and push (npm run push -- "commit message")
- postman collection


# first time: install modules and run
```
npm run first-time:local
```

# postman collection
you can import postman collection located in
```
docs/url_shortener.postman_collection.json
```

# swagger
```
http://127.0.0.1:5001/swagger
```

# update packages: update all packages to the latest version
```
npm run update
```

# restore packages: restore backup already saved in /backups
```
npm run restore
```

# clean packages: delete and reinstall packages
```
npm run clean
```