# Zapier

## Requirements

+ Nodejs v8.10.0

## If you'd like to manage your local App, use these commands:

+ zapier init . --template=resource - initialize/start a local app project (see templates here)
+ zapier convert 1234 . - initialize/start from an existing app (alpha)
+ zapier scaffold resource Contact - auto-injects a new resource, trigger, etc.
+ zapier test - run the same tests as npm test
+ zapier validate - ensure your app is valid
+ zapier describe - print some helpful information about your app
+ zapier apps - list the apps in Zapier you can administer
+ zapier register "Name" - creates a new app in Zapier
+ zapier link - lists and links a selected app in Zapier to your current folder
+ zapier history - print the history of your app
+ zapier collaborate [user@example.com] - add admins to your app who can push
+ zapier invite [user@example.com] [1.0.0] - add users to try your app version 1.0.0 before 
promotion

## How to create an Zapier app:  

+ Make directory on OS for new application:

    ```$ mkdir example-app```

+ Using barebond app:

    ```$ cd example-app```
    ```$ zapier init . --template==minimal``

## References:

+ zapier-platform-schema: <https://zapier.github.io/zapier-platform-schema/build/schema.html#resourceschema>

