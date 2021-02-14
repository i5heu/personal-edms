import express from "express";

let ipCache: number[] = [];
let ipLoginCache: number[] = [];
export function resetIpCache() {
  ipCache = [];
  setTimeout(resetIpCache, 10000); // 10sec
}
export function resetLoginIpCache() {
  ipLoginCache = [];
  setTimeout(resetIpCache, 300000); // 5min
}

export function loginLeft(req: express.Request): number {
  if (!ipLoginCache[req.ip]) return 5;
  return 5 - ipLoginCache[req.ip];
}

export function reqCheck(
  req: express.Request,
  res: express.Response,
  login = false
): boolean {
  if (login) {
    if (!ipLoginCache[req.ip]) ipLoginCache[req.ip] = 0;
    ipLoginCache[req.ip]++;

    if (ipLoginCache[req.ip] > 5) {
      res.status(429).send("429 Too Many Requests");
      return false;
    }
  } else {
    if (!ipCache[req.ip]) ipCache[req.ip] = 0;
    ipCache[req.ip]++;

    if (ipCache[req.ip] > 30) {
      res.status(429).send("429 Too Many Requests");
      return false;
    }
  }

  return true;
}
