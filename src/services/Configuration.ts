/*
Response from /api/edge/get.json
*/

interface FirewallRule {
    'default-action': string;
    description: string;
    'enable-default-log'?: any;
    rule: {
        [key: string]: {
            action: string;
            description: string;
            destination?: {
                port?: string,
                address?: string,
                group?: {
                    'address-group'?: string;
                    'port-group'?: string;
                    'network-group'?: string;
                },
            };
            protocol?: string;
            source?: {
                port?: string;
                address?: string;
            };
            state?: {
                invalid?: string
                established?: string
                related?: string
                new?: string;
            },
            log?: string
        }
    }
}

interface Firewall {
    'all-ping': string;
    'broadcast-ping': string;
    group: {
        'address-group': {
            [key: string]: {
                address: string[];
                description: string;
            }
        };
        'network-group': {
            [key: string]: {
                description: string;
                network: string[];
            }
        };
        'port-group': {
            [key: string]: {
                description: string;
                port: string[];
            }
        };
    };
    'ipv6-name': {
        [key: string]: FirewallRule;
    };
    'ipv6-receive-redirects': string;
    'ipv6-src-route': string;
    'ip-src-route': string;
    'log-martians': string;
    name: {
        [key: string]: FirewallRule
    };
    'receive-redirects': string;
    'send-redirects': string;
    'source-validation': string;
    'syn-cookies': string;
}

interface Ethernet {
    [key: string]: {
        address?: string[];
        description: string;
        'dhcp-options'?: {
            'default-route': string;
            'default-route-distance': string;
            'name-server': string;
        };
        duplex: string;
        firewall?: {
            in: {
                'ipv6-name': string;
                name: string;
            };
            local: {
                'ipv6-name': string;
                name: string;
            };
        };
        poe?: {
            output: string;
        };
        speed: string;
    }
}


interface Switch {
    [key: string]: {
        address: string[];
        description: string;
        mtu: string;
        'switch-port': {
            interface: {
                [key: string]: {
                    vlan: {
                        pvid: string;
                        vid?: string[];
                    };
                }
            };
            'vlan-aware': string;
        };
        vif: {
            [key: string]: {
                address: string[];
                description: string;
                firewall?: {
                    in: {
                        name: string;
                    };
                    local: {
                        name: string;
                    };
                };
                mtu?: string;
                ip?: {
                    'enable-proxy-arp'?: any;
                };
            }
        };
    }
}

interface Interfaces {
    ethernet: Ethernet;
    loopback: {
        lo?: any;
    };
    switch: Switch;
}

interface Protocols {
    'igmp-proxy': {
        interface: {
            [key: string]: {
                role: string;
                threshold: string;
            };
        }
    };
    static: {
        route: {
            [key: string]: {
                'next-hop': {
                    [key: string]: {
                        description: string;
                        disable?: any;
                    };
                };
            };
        };
    };
}

interface DhcpRelay {
    interface: string[];
    server: string[];
}

interface DhcpServer {
    disabled: string;
    'hostfile-update': string;
    'shared-network-name': {
        [key: string]: {
            authoritative: string;
            subnet: {
                [key: string]: {
                    'default-router': string;
                    'dns-server': string[];
                    lease: string;
                    start: {
                        [key: string]: {
                            stop: string;
                        };
                    };
                };
            };
        }
    };
    'static-arp': string;
    'use-dnsmasq': string;
}

interface Service {
    'dhcp-relay': DhcpRelay;
    'dhcp-server': DhcpServer;
    dns: {
        forwarding: {
            'cache-size': string;
            'listen-on': string[];
        };
    };
    gui: {
        'http-port': string;
        'https-port': string;
        'older-ciphers': string;
    };
    mdns: {
        repeater: {
            interface: string[];
        };
    };
    nat: {
        rule: {
            [key: string]: {
                description: string;
                'outbound-interface': string;
                type: string;
            }
        };
    };
    ssh: {
        port: string;
        'protocol-version': string;
    };
    unms: {
        connection: string;
    };
}

interface Login {
    user: {
        [key: string]: {
            authentication: {
                'encrypted-password': string;
                'plaintext-password': string;
            };
            'full-name'?: string;
            level: string;
        }
    };
}

interface System {
    'analytics-handler': {
        'send-analytics-report': string;
    };
    'crash-handler': {
        'send-crash-report': string;
    };
    'domain-name': string;
    'flow-accounting': {
        'ingress-capture': string;
        interface: string[];
        'syslog-facility': string;
    };
    'host-name': string;
    login: Login;
    'name-server': string[];
    ntp: {
        server: {
            [key: string]: any
        };
    };
    offload: {
        hwnat: string;
        ipsec: string;
    };
    syslog: {
        global: {
            facility: {
                all: {
                    level: string;
                };
                protocols: {
                    level: string;
                };
            };
        };
    };
    'time-zone': string;
    'traffic-analysis': {
        dpi: string;
        export: string;
    };
}

interface GET {
    firewall: Firewall;
    interfaces: Interfaces;
    vpn: string;
    protocols: Protocols;
    layer2: string;
    service: Service;
    system: System;
    'traffic-control': string;
    'onu-list': string;
    'onu-profiles': string;
    'onu-policies': string;
}

export interface Configuration {
    SESSION_ID: string;
    GET: GET;
    success: boolean;
}