## Process the Problem

### Understand the Problem
I want to create a simple image generator using replicate.com and this model: https://replicate.com/nvidia/sana-sprint-1.6b. 
User will enter my web application and enter a prompt in an input. 
The output image should be displayed above the prompt input. Application should have a navigation bar with warsawjs logo https://www.warsawjs.com/
Application should have a footer with https://www.warsawjs.com/ link and some funny quote about LLMs.
Application should be responsive on all devices like phones, tablets, laptops, and desktops.

Acceptance criteria for the application:
- application should have a simple prompt input and button to send it. The value from the input will be used as an input for the image generator model. 
- project should utilize nextjs v15
- project should utilize https://shoelace.style/ for styling
- project should include unit and integration tests, try to avoid mocks where possible
- generation of image should be hidden behind next api routes
- application should be deployable to vercel hosting
- api keys should be hidden in .env file and should not be visible to public
- background of the web page should be a fancy gradient 

### Examples/Test Case
- Users can enter the web page, input their prompt in the input and display the generated image
- User can click in https://www.warsawjs.com/ footer link
- User can see navigation bar with https://www.warsawjs.com/ logo
