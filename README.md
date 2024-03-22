
# AETC Installation guide

Steps to be followed to run the mahis AETC client.




## Prerequisites

`Docker`
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in apps/aetc/ folder

`NEXT_PUBLIC_API_URL=http://182.218.225.103:3001/api/v1`




## Build

Run the command below in the root folder of the project to build a docker image for aetc.

```bash
  docker build -t aetc .
```


## Running

To run the app

```bash
  docker run -p ${hostport}:3000 -d aetc
```

