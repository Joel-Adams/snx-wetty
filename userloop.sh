#!/bin/bash

TERMCOUNT=50
for (( i=1; i<=$TERMCOUNT; i++ ))
do
    printf -v loopnum "%02d" $i
    echo "Setting up labuser$loopnum"
    useradd -d /home/labuser$loopnum -m -s /bin/bash labuser$loopnum
    echo "labuser$loopnum:RedHat123" | chpasswd
    echo 'export PS1="\[$(tput bold)\]\[\033[38;5;1m\][\[$(tput sgr0)\]\[\033[38;5;39m\]\u@\h\[$(tput bold)\]\[\033[38;5;136m\]:\[$(tput sgr0)\]\[$(tput bold)\]\[\033[38;5;33m\]\w\[$(tput sgr0)\]\[\033[38;5;1m\]]\[$(tput sgr0)\]\[\033[38;5;57m\]\\$\[$(tput sgr0)\]\[$(tput sgr0)\]\[\033[38;5;15m\] \[$(tput sgr0)\]"' >> /home/labuser$loopnum/.bashrc
    echo 'export PS1="\[$(tput bold)\][\u@\h:\w]\\$ \[$(tput sgr0)\]"' >> /home/labuser$loopnum/stdprompt
done
