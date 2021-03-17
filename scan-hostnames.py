#!/usr/bin/env python
import os
import json

output = {}

addresses = os.popen('ip neigh').read().splitlines()
for i, line in enumerate(addresses, start=1):
    ip = line.split(' ')[0]
    h = os.popen('host {}'.format(ip)).read()
    hostname = h.split(' ')[-1].replace(".\n", "").replace("\n", "")
    if hostname != "NXDOMAIN":
        output[ip] = hostname

if not os.path.exists("/var/www/htdocs/dashboard/config/"):
    os.makedirs("/var/www/htdocs/dashboard/config/")

f = open("/var/www/htdocs/dashboard/config/hostnames.json", "w")
f.write(json.dumps(output))
f.close()