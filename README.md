
# Dev Stages

## 1st

### Pending details:
- Prototype: [Adobe XD](https://xd.adobe.com/view/4eda1450-37ce-4909-885e-2860c6e61405-1b89/screen/b3af2080-ef7c-4090-9f70-ff94fa3f2a46/?mv=product&mv2=accc&product=Creative+Cloud+Desktop&product-version=5.6.0.788)
- Design images and icons
- Specify editable data 
- Services for each section (at least with dummy data)
- License and actives module design

## 2nd

- Prototype: [Adobe XD](https://xd.adobe.com/view/098013ca-13cc-42ad-8414-65739a9a9a55-5cd3/)
- Flow: 


## Setup

Starting from the project root, in order to install dependencies run

```sh
$ npm ci
$ npm start
```

# Deploy

```sh
# If deploying to dev environment
$ npm run build:dev

# If deploying to prd environment
$ npm run build:prd

$ aws s3 --profile [aws-profile] sync build s3://[bucket-name]
```


