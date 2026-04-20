# AWS & Auto Scaling Group Deployments

## What is AWS?
Amazon Web Services (AWS) is a massive cloud deployment environment. We use AWS to deploy the Task Manager app from our local laptops into a highly available server rack that people worldwide can visit.

## What is an Auto Scaling Group (ASG)?
An **Auto Scaling Group** is an AWS feature that automatically adjusts the number of virtual servers (EC2 instances) running your application based on live traffic. If your Task Manager app gets very popular and CPU usage spikes, the ASG will spin up brand new servers to handle the load and automatically connect them to your Application Load Balancer!

## Architecture Details
In the root directory, there is an `aws-cfn-autoscaling.yml` file. This is an "Infrastructure as Code" CloudFormation Template. It defines:
1. **Application Load Balancer**: Distributes incoming internet traffic seamlessly across all active instances.
2. **Launch Template**: Provides instructions to AWS on how to set up the server (e.g. "Install Docker", "Run Frontend image", "Run Backend image").
3. **Target Tracking Scaling**: We specifically instruct AWS to scale when average CPU hits 70%.

## How to Deploy

1. Login to the AWS Management Console and navigate to **CloudFormation**.
2. Click **Create Stack** and upload the `aws-cfn-autoscaling.yml` file.
3. Pass in your preferred VPC, public subnets, and EC2 instance types when prompted by the AWS UI.
4. AWS will automatically provision the Load Balancer, Launch Templates, and Auto Scaling Group. You can find the resulting internet URL for your application in the "Outputs" tab of the Stack.
