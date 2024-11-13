1  cd emr-api-core/
    2  ls
    3  cat config/nlims.yml 
    4  tail -f nohup.out 
    5  cd metabase/
    6  tail -f nohup.out 
    7  MB_JETTY_PORT=3001 nohup java -Xms2g -Xmx4g -jar metabase.jar &
    8  tail -f nohup.out 
    9  tail -n nohup.out 
   10  tail -n 20 nohup.out 
   11  tail -n 50 nohup.out 
   12  MB_JETTY_PORT=3001 java -jar metabase.jar
   13  ls
   14  clear
   15  ls
   16  clear
   17  ls
   18  history
   19  cd /var/www/hwis/
   20  ls
   21  cp -r aetc/ aetc-test
   22  cd aetc-test/
   23  ls
   24  rm -rf .next/
   25  rm next.tar.gz 
   26  cd ~
   27  cp next.tar.gz /var/www/hwis/aetc-test/
   28  cd /var/www/hwis/aetc-test/
   29  ls
   30  tar -xzvf next.tar.gz 
   31  pm2 list
   32  clear
   33  ls
   34  cat ecosystem.config.js
   35  lsof -i :3000
   36  vim ecosystem.config.js
   37  history
   38  pm2 start ecosystem.config.js --env production
   39  sudo vim /etc/nginx/conf.d/aetc.conf 
   40  sudo nginx -t
   41  systemctl restart nginx
   42  systemctl status nginx
   43  top
   44  lscpu
   45  exit
   46  htop
   47  lscpu
   48  top
   49  op
   50  top
   51  rm /var/www/hwis/aetc/next.tar.gz 
   52  ls /var/www/hwis/
   53  cp next.tar.gz /var/www/hwis/aetc/
   54  cd /var/www/hwis/aetc/
   55  pm2 list
   56  pm2 stop aetc
   57  tar -xzvf next.tar.gz 
   58  pm2 start ecosystem.config.js --env production
   59  cat ecosystem.config.js
   60  rm /var/www/hwis/aetc/next.tar.gz 
   61  cp next.tar.gz /var/www/hwis/aetc/
   62  cd /var/www/hwis/aetc/
   63  rm -rf .next/
   64  tar -xzvf next.tar.gz 
   65  ls
   66  pm2 list
   67  pm2 stop aetc
   68  pm2 start ecosystem.config.js --env production
   69  df -h
   70  exit
   71  rm /var/www/hwis/aetc/next.tar.gz 
   72  cp next.tar.gz /var/www/hwis/aetc/
   73  cd /var/www/hwis/aetc/
   74  rm -rf .next/
   75  tar -xzvf next.tar.gz 
   76  pm2 list
   77  pm2 stop aetc
   78  pm2 start ecosystem.config.js --env production
   79  cd public/
   80  cd constants/
   81  vim printers.json
   82  cat printers.json 
   83  cd ..
   84  pm2 stop aetc
   85  pm2 start ecosystem.config.js --env production
   86  ls public/constants/
   87  ls
   88  cd /var/
   89  ls
   90  cd www/
   91  ls
   92  cd emr-backend/
   93  ls
   94  cd emr-api-core/
   95  clear
   96  ls
   97  cat config/nlims.yml 
   98  vim config/nlims.yml 
   99  crontab -l
  100  git status
  101  git log
  102  clear
  103  git log
  104  clear
  105  exit
  106  ls
  107  cd /var/
  108  ls
  109  cd www/
  110  ls
  111  cd emr-backend/
  112  clear
  113  ls
  114  cd emr-api-core/
  115  ls
  116  cd bin/
  117  ls
  118  exit
  119  ls
  120  clear
  121  ls
  122  ls -la
  123  mysql -uroot -p
  124  cd /var/
  125  ls
  126  cd www/
  127  clear
  128  ls
  129  cd emr-backend/
  130  ls
  131  cd emr-api-core/
  132  clear
  133  ls
  134  cat config/database.yml
  135  mysql -uroot -p
  136  clear
  137  mysqldump -uroot -p emr_api_core_development > emr_api_core_development.sql
  138  ls a
  139  ls -a
  140  ls -lrth
  141  free -h
  142  free
  143  free -h
  144  clear
  145  sudo nginx -t
  146  ls
  147  sudo vim /etc/nginx/conf.d/aetc.conf 
  148  sudo nginx -t
  149  sudo vim /etc/nginx/conf.d/aetc.conf
  150  sudo nginx -t
  151  sudo systemctl restart nginx
  152  df -h
  153  history
  154  cd /var/www/emr-backend/emr-api-core/
  155  ls
  156  cd log/
  157  ls -lh
  158  df -h
  159  cd
  160  cd /var/www/
  161  ls
  162  cd deployment/
  163  ls
  164  cd emr-api-core/log/
  165  ls
  166  ls -lh
  167  rm development.log 
  168  df -h
  169  ls
  170  exit
  171  history
  172  du -h / 2>/dev/null | grep '[0-9\.]\+G'
  173  cd /var/www/deployment/emr-api-core/log
  174  ls
  175  ls -lh
  176  free -h
  177  top
  178  clear
  179  ls
  180  cd emr-api-core/
  181  ls
  182  tail -f log/development.log 
  183  ls log/
  184  tail -f log/environment.log 
  185  cat log/environment.log 
  186  ls
  187  cd metabase/
  188  history
  189  MB_JETTY_PORT=3001 nohup java -jar metabase.jar 
  190  java -jar metabase.jar 
  191  MB_JETTY_PORT=3001 java -jar metabase.jar 
  192  df
  193  clear
  194  exit
  195  letmein
  196  df -h
  197  exit
  198  cd metabase/
  199  MB_JETTY_PORT=3001 nohup java -jar metabase.jar 
  200  clear
  201  df -h
  202  cd /var/www/
  203  ls
  204  clear
  205  cd emr-backend/
  206  ls
  207  cd emr-api-core/
  208  ls
  209  ls -la
  210  clear
  211  ls -la
  212  ls -h
  213  ls -lh
  214  clear
  215  cd /etc/systemd/system/
  216  ls
  217  cat mahis-api.service 
  218  systemctl mahis-api status
  219  systemctl status mahis-api.service 
  220  q
  221  clear
  222  logrotate --version
  223  cd /var/www/emr-backend/emr-api-core/
  224  ls
  225  clear
  226  CD
  227  cd
  228  clear
  229  sudo nano /etc/logrotate.d/rails-app
  230  clear
  231  cd /var/www/emr-backend/emr-api-core/
  232  pwd
  233  clear
  234  sudo nano /etc/logrotate.d/rails-app
  235  ls
  236  cd tmp/
  237  ls
  238  clear
  239  ls
  240  clear
  241  sudo logrotate -d /etc/logrotate.d/rails-app
  242  clear
  243  sudo nano /etc/logrotate.d/rails-app
  244  clear
  245  sudo nano /etc/logrotate.d/rails-app
  246  clear
  247  sudo logrotate -v /etc/logrotate.d/rails-app
  248  clear
  249  ls
  250  clear
  251  sudo logrotate -v /etc/logrotate.d/rails-app
  252  clear
  253  ls -ld /var/www/emr-backend/emr-api-core/log
  254  sudo nano /etc/logrotate.d/rails-app
  255  clear
  256  sudo chmod o-w /var/www/emr-backend/emr-api-core/log
  257  sudo nano /etc/logrotate.d/rails-app
  258  sudo logrotate -v /etc/logrotate.d/rails-app
  259  clear
  260  sudo nano /etc/logrotate.d/rails-app
  261  clear
  262  ls -lh
  263  clear
  264  sudo nano /etc/logrotate.d/rails-app
  265  clear
  266  sudo logrotate -v /etc/logrotate.d/rails-app
  267  ls
  268  cat development_secret.txt 
  269  clear
  270  ls
  271  sudo rm -rf development_secret.txt 
  272  ls
  273  sudo logrotate -v /etc/logrotate.d/rails-app
  274  clear
  275  sudo nano /etc/logrotate.d/rails-app
  276  clear
  277  sudo logrotate -v /etc/logrotate.d/rails-app
  278  ls
  279  cd ../
  280  ls
  281  cd log/
  282  ls
  283  mkdir old_logs
  284  ls
  285  clear
  286  sudo logrotate -v /etc/logrotate.d/rails-app
  287  clear
  288  ls
  289  cd old_logs/
  290  ls
  291  cd ../
  292  ls
  293  clear
  294  cat development.log 
  295  clear
  296  sudo mv /etc/logrotate.d/rails-app /etc/logrotate.d/mahis-aetc
  297  cd /etc/logrotate.d/
  298  ls
  299  clear
  300  sudo logrotate -v /etc/logrotate.d/mahis-aetc 
  301  clear
  302  sudo logrotate -v /etc/logrotate.d/mahis-aetc
  303  clear
  304  sudo nano /etc/logrotate.d/mahis-aetc 
  305  clear
  306  sudo nano /etc/logrotate.d/mahis-aetc 
  307  clear
  308  sudo logrotate -v /etc/logrotate.d/mahis-aetc
  309  clear
  310  df -h
  311  cd -
  312  history 
  313  last
  314  cd /var/www/deployment/emr-api-core
  315  cd log/
  316  ls
  317  ls -lh
  318  cd ../../
  319  cd ..
  320  ls
  321  exit
  322  mysqldump -u root -p emr_api_core_development >db_dump12092024.sql
  323  ls
  324  exit
  325  ls
  326  cd metabase/
  327  ls
  328  exit
  329  ls
  330  clear
  331  ls
  332  exit
  333  ls
  334  cd /var/www/
  335  ls
  336  cd deployment/
  337  ls
  338  cd emr-api-core
  339  ls
  340  cd ..
  341  ls
  342  cat api_setup.sh 
  343  ;s
  344  ls
  345   apiemr-api-core
  346  cd /var/www/
  347  ls
  348  cd hwis
  349  ls
  350  cat core_setup.sh 
  351  ls
  352  cd aetc
  353  ls
  354  cat start.sh 
  355  ls
  356  du -h
  357  df -h
  358  cd metabase/
  359  ls
  360  tail -f nohup.out 
  361  lsof -i:3001
  362  MB_JETTY_PORT=3001 nohup java -jar metabase.jar 
  363  clear
  364  clear
  365  sudo logrotate -v /etc/logrotate.d/mahis-aetc 
  366  lsclear
  367  ls
  368  sudo docker ps
  369  history
  370  cd /var/www/hwis/aetc/
  371  pm2 list
  372  curl localhost
  373  clear
  374  lsof -i :3000
  375  clear
  376  cat /etc/nginx/conf.d/aetc.conf
  377  curl http://localhost:8000
  378  clear
  379  history
  380  sudo nginx -t
  381  sudo systemctl nginx restart
  382  sudo systemctl restart nginx
  383  pm2 list
  384  cat ecosystem.config.js 
  385  pm2 stop aetc
  386  pm2 stop aetctest
  387  pm2 kill
  388  pm2 resurrect
  389  pm2 list
  390  clear
  391  pm2 start ecosystem.config.js --env production
  392  pm2 list
  393  pm2 save
  394  pm2 save --force
  395  clear
  396  df -h
  397  ls
  398  cd ..
  399  ls
  400  cd emr-api-core/
  401  ls
  402  cd log/
  403  ls
  404  df -h
  405  du -sh development.log 
  406  cd ..
  407  ls
  408  cd ..
  409  ls
  410  cd ..
  411  ls
  412  history
  413  find / -type f -size +1G
  414  sudo find / -type f -size +1G
  415  lsls
  416  clear
  417  pwd
  418  df -h
  419  sudo find / -type f -exec du -h {} + | sort -rh | head -n 10
  420  sudo find / -type f -exec sudo du -h {} + | sort -rh | head -n 10
  421  sudo du -ah /  | sort -rh | head -n 10
  422  ls
  423  cd var/
  424  ls
  425  cd www/
  426  ls
  427  cd hwis
  428  ls
  429  cd aetc
  430  ls
  431  rm next.tar.gz 
  432  sudo du -ah /  | sort -rh | head -n 10
  433  cat /etc/logrotate.d/mahis-aetc 
  434  cat /var/www/emr-backend/emr-api-core/tmp/restart.txt
  435  ls /etc/logrotate.d/
  436  cd /home/meduser/
  437  ls
  438  rm next.tar.gz 
  439  clear
  440  ls
  441  rm emr_api_core_test.sql.gz 
  442  sudo find / -type f -size +100M -exec du -h {} + | sort -rh | head -n 20
  443  rm /var/www/deployment/emr-api-core/log/development.log
  444  cd /var/
  445  ls
  446  cd www/
  447  ls
  448  cd hwis
  449  ls
  450  cd aetc
  451  ls
  452  pm2 start ecosystem.config.js --env production
  453  clear
  454  cd /var/www/emr-backend/
  455  ls
  456  cd emr-api-core/
  457  df -h
  458  ls
  459  cd log/
  460  ls
  461  ls -la
  462  ls -h
  463  ls -la
  464  ls -lah
  465  clear
  466  df -h
  467  clear
  468  cat /var/www/deployment/emr-api-core/log/development.log
  469  cd /var/www/deployment/emr-api-core/log/
  470  ls -la
  471  ls -h
  472  ls
  473  cd ../
  474  ls
  475  cat /etc/systemd/system/mahis-api.service 
  476  clear
  477  ls
  478  ls -la
  479  ls -h
  480  ls -lah
  481  clear
  482  ls
  483  htop
  484  clear
  485  ls -la
  486  df -h
  487  history
  488  cd /var/www/deployment/emr-api-core/log/
  489  ls
  490  ls -lh
  491  cd
  492  du -h / 2>/dev/null | grep '[0-9\.]\+G'
  493  cd /var/log
  494  ls
  495  ls -lh
  496  rm syslog.1
  497  history 
  498  df -h
  499  sudo reboot now
  500  ls
  501  history 
  502  sudo find / -type f -size +100M -exec du -h {} + | sort -rh | head -n 20
  503  ls
  504  :q
  505  exit
  506  cd /var/www/hwis/aetc/
  507  pm2 list
  508  pm2 start ecosystem.config.js --env production
  509  clear
  510  ls
  511  ls -la
  512  clear
  513  ls -lah
  514  clear
  515  sudo nano /etc/logrotate.d/mahis-aetc
  516  [200~sudo rm /etc/logrotate.d/mahis-aetc
  517  sudo rm /etc/logrotate.d/mahis-aetc 
  518  sudo logrotate -d /etc/logrotate.conf
  519  clear
  520  ls
  521  clear
  522  tmux a -t log
  523  df -h
  524  tmux 
  525  history 
  526  cd /var/www/deployment/emr-api-core/log/
  527  ls
  528  ls -lh
  529  ls
  530  pwd
  531  logrotate --v
  532  logrotate --version
  533  ls
  534  ls -lh
  535  /usr/sbin/logrotate /var/www/logrotate/logrotate.conf --state /var/www/logrotate/logrotate-state
  536  ls
  537  ls -lh
  538  tmux new -s log
  539  exit
  540  clear
  541  tmux a -t log
  542  clear
  543  dh -h
  544  df -h
  545  cd /etc/logrotate.d/
  546  ls
  547  cat mahis-aetc 
  548  cd metabase/
  549  history
  550  MB_JETTY_PORT=3001 nohup java -jar metabase.jar
  551  ls
  552  alias
  553  alias metabase="MB_JETTY_PORT=3001 nohup java -jar /home/meduser/metabase/metabase.jar"
  554  metabase
  555  cd metabase/
  556  ls
  557  metabase
  558  history
  559  metabase
  560  MB_JETTY_PORT=3001 nohup java -jar /home/meduser/metabase/metabase.jar
  561  cd metabase/
  562  MB_JETTY_PORT=3001 nohup java -jar /home/meduser/metabase/metabase.jar
  563  metabase
  564  MB_JETTY_PORT=3001 nohup java -jar /home/meduser/metabase/metabase.jar
  565  cd metabase/
  566  MB_JETTY_PORT=3001 nohup java -jar /home/meduser/metabase/metabase.jar
  567  df
  568  cd /var/www
  569  ls
  570  cd emr-backend/
  571  ls
  572  cd emr-api-core/
  573  ls
  574  ls -hl
  575  cd ../..
  576  ls
  577  cd deployment/
  578  ls
  579  cd
  580  ls
  581  ls -hl
  582  cd /var/
  583  ls
  584  cd log/
  585  ls
  586  ls -hl
  587  cd ..
  588  ls
  589  cd log/
  590  ls
  591  ls -hl
  592  cd ..
  593  ls
  594  cd www/
  595  ls
  596  cd emr-api-core/
  597  ls
  598  cd config/
  599  ls
  600  cat database.yml
  601  cd ..
  602  ls
  603  cd ..
  604  ls
  605  cd logrotate/
  606  ls
  607  cat logrotate.conf 
  608  cd ..
  609  cd deployment/
  610  cd emr-api-core
  611  cd log/
  612  ls
  613  ls -hl
  614  cd
  615  ls
  616  cd /var
  617  ls\
  618  ls
  619  cd www/
  620  ls
  621  cd deployment/
  622  ls
  623  cd emr-api-core
  624  ls
  625  cd log/
  626  ls
  627  ls -hl
  628  cd ..
  629  ls
  630  cd ../..
  631  ls
  632  cd emr-backend/
  633  ls
  634  cd emr-api-core/
  635  ls
  636  cd log/
  637  ls
  638  ls -hl
  639  cd ..
  640  ls
  641  cd emr-api-core/
  642  ls
  643  cd log/
  644  ls
  645  ls -hl
  646  cd
  647  cd /etc/
  648  ls 
  649  cd systemd/
  650  ls
  651  df
  652  cd ..
  653  cd 
  654  cd /var/www/
  655  cd logrotate/
  656  cd ..
  657  cd lo
  658  cd log/
  659  ls
  660  ls -hl
  661  sudo rm -rf syslog
  662  sudo rm -rf syslog.1 
  663  ls
  664  df
  665  df -h
  666  exit
  667  pwd
  668  cd ../../../
  669  ls
  670  cd logrotate/
  671  ls
  672  vim logrotate.conf 
  673  vim logrotate-state 
  674  crontab -e
  675  cd /var/www/deployment/emr-api-core/log
  676  ls
  677  ls -lh
  678  systemctl status mahis-api.service 
  679  exit
  680  sudo systemctl restart nginx
  681  pm2 list
  682  pm2 start aetc
  683  cd /var/
  684  ls
  685  cd www/
  686  ls
  687  cd hwis
  688  ls
  689  cd aetc
  690  pm2 start aetc
  691  ls
  692  bash start.sh 
  693  pm2 list
  694  npm start
  695  ls
  696  cat start.sh 
  697  pm2 start ecosystem.config.js --env production
  698  ls
  699* 
  700  lsof -i :8000
  701  pm2 list
  702  npm start
  703  history > historymahis