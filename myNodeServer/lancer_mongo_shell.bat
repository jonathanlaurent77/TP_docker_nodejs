set MONGO_HOME=C:\Program Files\MongoDB\Server\5.0
set SERV_URL=mongodb://localhost:27017
REM set SERV_URL=mongodb://localhost:27017/devise_db
REM set USERNAME=superuser
REM set PASSWORD=motdepasse
set USERNAME=""
set PASSWORD=""
cd /d "%~dp0"
"%MONGO_HOME%\bin\mongo.exe" %SERV_URL% -u %USERNAME% -p %PASSWORD%
REM puis use devise_db et db.devises.find()
pause

REM export MONGO_HOME=/usr/...
REM ${MONGO_HOME}/bin/mongo ...