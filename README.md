gsping
====================

One small tool to crawl website and git a simple report in the console.

> Small crawling tool

## install ##

```bash
npm install -g gsping
```

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


