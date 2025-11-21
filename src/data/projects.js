export const projects = [
  {
    id: 'microservices-ecommerce',
    title: 'Microservices E-Commerce Platform',
    description: 'Scalable e-commerce platform built with microservices architecture using Spring Boot and Docker',
    detailedDescription: 'A comprehensive e-commerce platform designed with microservices architecture. The system includes separate services for user management, product catalog, order processing, and payment integration. Built with Spring Boot, deployed on AWS ECS, and orchestrated with Kubernetes for high availability and scalability.',
    technologies: ['Java Spring', 'Microservice', 'Docker', 'Kubernetes', 'AWS'],
    image: '/images/ecommerce-project.jpg',
    link: 'https://github.com/minhngo/ecommerce-platform'
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Automation',
    description: 'Automated deployment pipeline with Jenkins, Docker, and AWS for continuous integration and delivery',
    detailedDescription: 'Designed and implemented a complete CI/CD pipeline that automates the build, test, and deployment process. The pipeline uses Jenkins for orchestration, Docker for containerization, and AWS CodePipeline for deployment to production environments. Reduced deployment time by 70% and improved reliability.',
    technologies: ['DevOps', 'Docker', 'AWS', 'Jenkins'],
    image: '/images/cicd-project.jpg',
    link: 'https://github.com/minhngo/cicd-automation'
  },
  {
    id: 'cloud-native-api',
    title: 'Cloud-Native REST API',
    description: 'High-performance REST API built with Spring Boot, deployed on AWS with auto-scaling capabilities',
    detailedDescription: 'A cloud-native REST API service built with Spring Boot and deployed on AWS infrastructure. Features include auto-scaling based on load, Redis caching for improved performance, RDS for data persistence, and CloudWatch for monitoring. Handles over 10,000 requests per second with 99.9% uptime.',
    technologies: ['Java Spring', 'AWS', 'Docker', 'Microservice'],
    image: '/images/api-project.jpg',
    link: 'https://github.com/minhngo/cloud-api'
  }
];
