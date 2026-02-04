# AWS Serverless Task Tracker

This project implements a serverless task management application leveraging various AWS services. The application provides a user-friendly frontend to interact with tasks, while all backend operations are handled by AWS Lambda functions.

## Project Structure

- `frontend/`: Contains all the static assets for the web application, including HTML, CSS, and JavaScript files for user interface and interaction.
- `lambda-functions/`: Houses the Python-based AWS Lambda functions responsible for the core business logic of the application, such as:
    - `create_task.py`: Handles the creation of new tasks.
    - `delete_task.py`: Manages the deletion of existing tasks.
    - `get_tasks.py`: Retrieves tasks for display in the frontend.
    - `update_task.py`: Modifies existing tasks.

- `demo.mp4`: A video demonstration showcasing the application's features and functionality.

## AWS Services Utilized

This project makes extensive use of the following AWS services:

- **AWS Lambda**: For executing the backend logic without provisioning or managing servers. Each task operation (create, read, update, delete) is implemented as a separate Lambda function.
- **AWS Cognito**: For creating JWT tokens for authentication and passing the token with every user request for validation.
- **Amazon API Gateway**: To create a RESTful API endpoint for the frontend to communicate with the Lambda functions. This acts as the entry point for all API requests.
- **Amazon DynamoDB**: (Assumed) As the NoSQL database for storing task data, providing fast and scalable access.
- **Amazon S3**: (Assumed) For hosting the static frontend assets, ensuring high availability and durability.
- **AWS Identity and Access Management (IAM)**: For securely managing access to AWS resources, ensuring that Lambda functions have the necessary permissions to interact with DynamoDB and other services.
- **AWS CloudFront CDN**: For securely hosting the applications on server closer to the user.

## Features

- **Task Creation**: Users can create new tasks with details like title, description, and status.
- **Task Listing**: Display a list of all existing tasks.
- **Task Update**: Allows users to modify task details.
- **Task Deletion**: Enables users to remove tasks.
- **Serverless Architecture**: Cost-effective and scalable solution, only paying for the compute time consumed by Lambda functions.
- **Scalable Database**: DynamoDB provides a highly scalable and performant database for task storage.
- **Secure Access**: IAM roles and policies ensure secure interactions between services.

## Setup and Deployment (Conceptual)

1.  **Configure AWS CLI**: Ensure your AWS CLI is configured with appropriate credentials.
2.  **Deploy Lambda Functions**: Package and deploy the Python Lambda functions to AWS.
3.  **Create API Gateway**: Set up API Gateway endpoints to trigger the respective Lambda functions.
4.  **Create DynamoDB Table**: Create a DynamoDB table to store task data .
5.  **Upload Frontend**: Upload the `frontend/` directory content to an S3 bucket configured for static website hosting.
6.  **Update Frontend Configuration**: Modify `frontend/config.js` to point to your deployed API Gateway endpoint.
