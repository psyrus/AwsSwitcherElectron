# AwsSwitcherElectron
The AWS Switcher for VPN connectivity, rewritten in Electron to learn the basics of Node and Electron

## Prerequisites

To use this system you will need to have the following:

- A EC2 instance with OVPN installed
  - <https://hackernoon.com/using-a-vpn-server-to-connect-to-your-aws-vpc-for-just-the-cost-of-an-ec2-nano-instance-3c81269c71c2>
  - Instance ID
- IAM user that has the permissions to stop and start the EC2 instance
  - Username and password for IAM user
- OVPN installed (2.5 and above) - <https://openvpn.net/community-downloads/>
- [Optional] Squad game installed

## Build

Simply use `npx electron-packager .` to build the package and use the output exe on your system. 
