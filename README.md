# README del frontend de Skops & Company
Se utilizó el framework REACT para nuestro *frontend*

## Instalación de REACT y ejecución del proyecto (en Linux)

- Para **Fedora**, se ejecutan los siguientes comandos:
```
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
```
```
sudo dnf install -y nodejs
```

Una vez terminado el proceso anterior, se ejecutan los siguientes comandos en la carpeta *skops-frontend*

```
rm -rf node_modules package-lock.json
```
```
npm install
```
```
npm install react-leaflet leaflet
```
```
npm start
```

- Para **Ubuntu**, se ejecutan los siguientes comandos:
```
sudo apt update
```
```
sudo apt install -y nodejs npm
```

Comprobamos la instalación:
```
node -v
```
```
npm -v
```

Una vez terminado el proceso anterior, se ejecutan los siguientes comandos en la carpeta *skops-frontend*

```
rm -rf node_modules package-lock.json
```
```
npm install
```
```
npm install react-leaflet leaflet
```
```
npm start
```

### Link del tablero de Notion:

https://www.notion.so/1b9189e86b3180d48277da33663f3dce?v=1b9189e86b318074b748000c57906171
