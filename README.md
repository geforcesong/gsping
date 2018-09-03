gsping
====================

One small tool to crawl website and get a simple performance report in the console.

> Small crawling tool for checking web performance

## install ##

```bash
npm install -g gsping
```

## Parameters ##

* **-v** show current running version.
* **-u** <url> to specify a url to test
* **-t** <number> to indicate how many times
* **-m** to use mobile user agent
* **--batch** to set batch crawling count
* **--existkey** this is keyword to check if it exists in response.
* **--interval** to set crawling interval time in miliseconds
* **--ua** <useragent> to indicate what ua you want to use. valid values: chrome(default), googlebot

## Usage ##

> example crawl google for 5 times.

```bash
gsping -u https://www.google.com -t 5
```

> example crawl google for 10 times, batch count 3 and interval 3s

```bash
gsping -u https://www.google.com -t 10 --batch 3 --interval 3000
```

> example crawl google with google mobile(-m) bot user agent

```bash
gsping -u https://www.google.com -t 5 -m --ua googlebot
```

> example checking some string existing in response

```zsh
gsping -u https://www.google.com -t 10 --existkey itemtype=\"http://schema.org/WebPage\"
```


