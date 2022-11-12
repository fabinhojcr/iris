@echo off
echo "Tentando iniciar de modo padrao..."
timeout /T 5
start /b /WAIT "" "C:\Program Files\Git\bin\bash.exe" tools.sh
cls
echo "Modo padrao falhou ou finalizou, usando modo alternativo..."
timeout /T 5
bash tools.sh
cls
echo "Modo alternativo e padrao falharam ou terminaram, pressione um botao para fechar..."
pause
