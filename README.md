## Simple MERN stack docker app! ##

## To get authentication working ##
Create a keys.json file under the server folder and populate it like this:

```javascript
{
    "GOOGLE_APPID": "2342342423232-lkjasdf8ui4rkasdlfkasd9f20hddacku.apps.googleusercontent.com",
    "GOOGLE_APPSECRET": "ASfasdfe234DSg902!SSSD",
    "FACEBOOK_APPID": "93939383838272",
    "FACEBOOK_SECRET": "234fasdf324323akallj323244",
    "MAILGUN_APIKEY": "23lk2j34l2k34adsf98asdfja-38cjdkdos-0didjaosl",
    "MAILGUN_DOMAIN": "mail.mydomain.com",
    "NO_REPLY_EMAIL": "noreply@mydomain.com"
}
```

### To run: ###
```
 docker-compose build
 docker-compose up
```
