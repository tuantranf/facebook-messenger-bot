# facebook-messenger-bot
A sample facebook messenger bot using messenger-bot module with some features such as zodiac, web crawler, ...

## Heroku deploy
```
git clone https://github.com/tuantranf/facebook-messenger-bot.git
heroku create
git push heroku master
heroku config:set FB_PAGE_ACCESS_TOKEN=YOUR-FB_PAGE_ACCESS_TOKEN
heroku config:set FB_PAGE_VERIFY_TOKEN=YOUR-FB_PAGE_VERIFY_TOKEN
```

## Connect to [Wit.ai](https://wit.ai/)
```
heroku config:set WIT_TOKEN=YOUR-WIT_TOKEN
```