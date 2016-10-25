CREATE TABLE employee(
empid SERIAL PRIMARY KEY,
empname VARCHAR(50),
isadmin BOOLEAN,
isactive BOOLEAN,
authid VARCHAR(50),
authpic VARCHAR(50),
authemail VARCHAR(50)
);


CREATE TABLE clients(
clientid SERIAL PRIMARY KEY,
clientname VARCHAR(100)
);

CREATE TABLE projects(
projectid SERIAL PRIMARY KEY,
startdate DATE,
enddate DATE,
projectname VARCHAR(100),
isactive BOOLEAN,
client_id INT REFERENCES clients(clientid)
);
CREATE TABLE time(
timeid SERIAL PRIMARY KEY,
date DATE,
hours VARCHAR(100),
description VARCHAR(150),
empid INT REFERENCES employee(empid),
projid INT REFERENCES projects(projectid)
);
CREATE TABLE emp_proj(
emp_id INT REFERENCES employee(empid),
project_id INT REFERENCES projects(projectid)
);



INSERT INTO employee(empname,isadmin,isactive) VALUES('matt',false,true);
INSERT INTO employee(empname,isadmin,isactive) VALUES('john',false,true);
INSERT INTO employee(empname,isadmin,isactive) VALUES('lisa',true,true);
INSERT INTO employee(empname,isadmin,isactive) VALUES('cody',false,true);

INSERT INTO clients(clientname) VALUES('matt, incorporated');
INSERT INTO clients(clientname) VALUES('john, incorporated');
INSERT INTO clients(clientname) VALUES('lisa, incorporated');
INSERT INTO clients(clientname) VALUES('cody, incorporated');

INSERT INTO projects(startdate,enddate,projectname,isactive,client_id) VALUES('2016-9-1','2016-10-1','build database',false,1);
INSERT INTO projects(startdate,enddate,projectname,isactive,client_id) VALUES('2016-8-13','2016-10-12','insert fake stub data',true,2);
INSERT INTO projects(startdate,enddate,projectname,isactive,client_id) VALUES('2016-1-23','2016-10-14','add another fake thing',true,3);
INSERT INTO projects(startdate,enddate,projectname,isactive,client_id) VALUES('2016-6-13','2016-10-23','get some food',false,3);

INSERT INTO time(date,hours,description,empid,projid) VALUES('2016-10-13',12,'I am describing this fake thing im making',2,3);
INSERT INTO time(date,hours,description,empid,projid) VALUES('2016-10-14',12,'I am not describing this thing im making',2,4);
INSERT INTO time(date,hours,description,empid,projid) VALUES('2016-10-23',12,'I am still describing this fake thing im data-ing',4,1);
INSERT INTO time(date,hours,description,empid,projid) VALUES('2016-10-27',12,'data',3,2);

INSERT INTO emp_proj(emp_id, project_id) VALUES(1,2);
INSERT INTO emp_proj(emp_id, project_id) VALUES(4,1);
INSERT INTO emp_proj(emp_id, project_id) VALUES(3,3);
INSERT INTO emp_proj(emp_id, project_id) VALUES(2,1);
