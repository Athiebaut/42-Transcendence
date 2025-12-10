# Access
Grafana : localhost:3000
Prometheus : localhost:9090

# Explications
Containers to monitor every dockers from a project.  
First build with node_exporter and prometheus only, but not accurate because node_exporter get host's system datas (cpu, ram, disk, network...) and not containers datas.  
Second build with CAdvisor to get accurate datas about each containers.  
CAdvisor get datas from volumes given in compose file.  
Then prometheus scrape CAdvisor metrics endpoint.  
Finally Grafana get datas from Prometheus to display on dashboard.

# Setup
Go to Grafana  
User : admin  
Pwd : admin  
You can change the password or skip  
Click on "Connections" on the left  
"Add new Connection"  
Search for Prometheus  
"Add new data source"  
Set the connection url to prometheus:9090  
Scroll down and save  

Go to Dashboards  
"Create dashboard"  
"Import dashboard"  
"Discard"  
Go to file ./monitoring/grafana/dashboard.json  
Print in the text box the file's content then "Load"  
Change dashboard's name if you want  
"Import"  
You probably need to update the widgets (If "no Data' is displayed). You just need to press "E" then "Escape" on every widgets. It should refresh them and display datas.  
DON'T FORGET TO SAVE ON UPPER RIGHT