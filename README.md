# deno_csv
CSV parser on deno


## Deno install
```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

```
Manually add the directory to your $HOME/.bash_profile (or similar)
  export DENO_INSTALL="/home/js/.deno"
  export PATH="$DENO_INSTALL/bin:$PATH"
```

## Deno project structure
app.ts is main entry point

## Running app
`deno run --allow-read app.ts`

## Running server
­`deno run --allow-net upload_server.ts`

## Watchin server

# Heroku deployment

Buildpack to be set
`https://github.com/chibat/heroku-buildpack-deno.git`

Procfile to be added

Add remote to heroku
`heroku git:remote -a infinite-fjord-96060`

push to heroku repo
`git push heroku`

