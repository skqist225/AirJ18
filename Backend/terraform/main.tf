terraform {
      required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.3.0"
    }
  }
}

provider "aws" {
  profile=var.profile
  region = var.region
}

resource "aws_key_pair" "deployer" {
  key_name   = "airj18-security-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMvN3JM0mGN1Fvkw42/CpGnimCklXU5i9oN7u67M1SAf skqist225@DESKTOP-TSOPMRN"
}

data "aws_vpc" "main" {
  id = "vpc-018ea4034e483d6f7"
}

data "template_file" "private_key" {
  template = file("~/.ssh/airj18")
}

resource "aws_security_group" "airj18_sg" {
  name        = "airj18-sg"
  description = "Ubuntu server security group"
  vpc_id      = data.aws_vpc.main.id

  ingress = [
    {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
    },
    {
    description      = "HTTPS"
    from_port        = 433
    to_port          = 433
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
    },
    {
    description      = "Database port for MYSQL"
    from_port        = 3306
    to_port          = 3306
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
    },
    {
    description      = "Tomcat port for application"
    from_port        = 8080
    to_port          = 8080
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
    },
    {
      description      = "SSH"
      from_port        = 22
      to_port          = 22
      protocol         = "tcp"
      cidr_blocks      = ["123.21.254.35/32"]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }

  ]

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }

  tags = {
    Name = "airj18-sg"
  }
}

resource "aws_instance" "my_server" {
  ami                    = "ami-0481a7756e237576c"
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.airj18_sg.id]
  # user_data              = data.template_file.user_data.rendered

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = data.template_file.private_key
      host        = "${self.public_ip}"
    }

    inline = [
      "echo ${self.private_ip} >> private_ips.txt",
    ]
  }

  tags = {
    Name = "airj18_app"
  }
}

output "public_ip" {
  value = aws_instance.my_server.public_ip
}