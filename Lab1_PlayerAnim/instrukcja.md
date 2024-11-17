# Lab 1 - Player Animation
### Zestaw najpotrzebniejszych komend

#### 1. Struktura
Plik ```setupProject.js``` automatycznie tworzy strukturę katalogow, polecenie:
```bash
node setupProject.js
```
#### 2. Typescrip
- Instalacja:
```bash 
npm install -g typescript
``` 
- Sprawdź instalację:
```bash 
tsc --version
```
- Utwórz plik konfiguracyjny TypeScript:
```bash 
tsc --init
```
- Kompilacja TypeScript:
```bash 
tsc
```
- Wyczyść ewentualny cache kompilatora
```bash
tsc --build --clean
```

#### 3. Serwer testowy

- Instalacja
```bash 
npm install -g http-server
``` 

- Uruchom serwer w katalogu projektu
```bash
http-server
```

- W przeglądarce otwórz adres
```bash
http://localhost:8080/playerAnim.html
```