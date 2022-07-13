# Zoho Desk + VTEX

First install the ZET CLI

```
npm install -g zoho-extension-toolkit
```

Run
This command runs the http server hosting the extension.

```
zet run 
```

1. To start the server and test the extension, run the following command:


This command makes the http server accessible through the 5000 port of your local machine. Make sure that the 5000 port is not occupied, before you start the server.

2. To verify if the server started successfully, open the following URL in your browser: [http://localhost:5000/plugin-manifest.json]

To test your extension, perform the following steps:

Depending on the computer you use, open Terminal or Command Prompt and navigate to your project folder.

Execute the zet run command.

If you use Mozilla Firefox, open [https://127.0.0.1:5000/plugin-manifest.json] in a new tab, and click Advanced ---> Accept the Risk and Continue.

If you use Google Chrome, open [https://127.0.0.1:5000/plugin-manifest.json] in a new tab and click Advanced ---> Proceed to Unsafe. 

If the Proceed to Unsafe option does not appear, enable the chrome://flags/#allow-insecure-localhost Chrome flag and restart the browser.  


Pack
To pack your extension
```
zet pack
```
