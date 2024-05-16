#capstone_project
Project link: https://github.com/alexraajan/Capstone
Steps to run the project
1. Download or clone the following repository from the GitHub link on the branch main.
2. Download the SQL server Management Studio and SQL Express for setting up the local DB server.
3. Create Database "RealEstate" in your local DB and keep it in use.
4. Extract the DB_Script folder and execute the Scheme.sql and Data.sql file present in the folder.
5. Change the DB connection string in the JSON file present in the following path "Capstone/Server/env_parameters/env_parameters.JSON".
6. Do the following pip install for setting up the server.
	pip install pandas
	pip install pyodbc
	pip install flask
	pip install flask-cors
7. Launch the dashboard by runing the index.HTML present in the following path "Capstone/Client/Index.html"
