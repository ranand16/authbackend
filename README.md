## GOAL
You are designing an ecommerce store. Clients can add items to their cart and checkout to successfully place an order. Every nth order gets a coupon code for 10% discount and can apply to their cart.

We would like you to design and implement APIs for adding items to cart and checkout functionality. The checkout API would validate if the discount code is valid before giving the discount.

Building a UI that showcases the functionality is a stretch goal. If you are primarily a backend engineer, you can also submit postman or REST client or equivalent.

The store also has two admin API's:

Generate a discount code if the condition above is satisfied.
Lists count of items purchased, total purchase amount, list of discount codes and total discount amount.
You can build this with a technology stack that you are comfortable with. You would push the code to your github repo and share the link once its complete. We would like to see your commits that show progression and thought process as to how you are completing the exercise.

Things that you will be evaluated on:

Functional code
Code quality
UI in a framework of your choice
Code comments, readme docs
Unit tests
Assumptions you can make:

The API’s don’t need a backend store. It can be an in-memory store.

### Config foler
* This should contain any configurations that needs to be used overall the project for any specific environment.
* This folder may have a default.json to have default values.
* To override any values in default.json plus to have environment specific values we need to create development.json or production.json or ... for diff environments like QA or staging

### .env config
* This should contain any secret configurations that needs to be used overall the project for any specific environment.
* Check /envLoader.js file to understand the environment file pickup strategy and have .env or .env.example or .env.development or .env.production
* Even .env.production or ... for diff environments like QA or staging we need to keep in a diff repo or copy environment via FTP

## Steps to setup in local:
* npm i 
* create config/{environment}.json file. Also check if default.json is needed.
* create .env.{environment}/.env/.env.local and add values from .env.example into it.
* npm run dev 


## Steps after deployment(Will try to deploy if time permits)
* config folder needs to have a production.json file (We can create a different repo or use FTP to copy production.json into config folder)
* .env.production also need to be there. Same method as production.json can be used to have it on server.
* I would use pm2 to run apps on server