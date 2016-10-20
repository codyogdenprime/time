db name: cimarron

CREATE TABLE employee(
empid SERIAL PRIMARY KEY,
empname VARCHAR(50),
isadmin BOOLEAN,
authid VARCHAR(50),
authpic VARCHAR(50),
authemail VARCHAR(50)
);

CREATE TABLE projects(
projectid SERIAL PRIMARY KEY,
projectname VARCHAR(100),
isactive BOOLEAN
);
CREATE TABLE time(
timeid SERIAL PRIMARY KEY,
date VARCHAR(100),
hours VARCHAR(100),
description VARCHAR(150),
empid INT REFERENCES employee(empid),
projectid INT REFERENCES projects(projectid)
);


INSERT INTO employee(empname,isadmin) VALUES('matt',false);
INSERT INTO employee(empname,isadmin) VALUES('john',false);
INSERT INTO employee(empname,isadmin) VALUES('lisa',true);
INSERT INTO employee(empname,isadmin) VALUES('cody',false);

INSERT INTO projects(projectname,isactive) VALUES('build database',false);
INSERT INTO projects(projectname,isactive) VALUES('insert fake stub data',true);
INSERT INTO projects(projectname,isactive) VALUES('add another fake thing',true);
INSERT INTO projects(projectname,isactive) VALUES('get some food',false);

INSERT INTO time(date,hours,description,empid,projectid) VALUES('10-22-2016',12,'I am describing this fake thing im making',2,3);
INSERT INTO time(date,hours,description,empid,projectid) VALUES('10-23-2016',12,'I am not describing this thing im making',2,4);
INSERT INTO time(date,hours,description,empid,projectid) VALUES('10-24-2016',12,'I am still describing this fake thing im data-ing',4,1);
INSERT INTO time(date,hours,description,empid,projectid) VALUES('10-25-2016',12,'data',3,2);
