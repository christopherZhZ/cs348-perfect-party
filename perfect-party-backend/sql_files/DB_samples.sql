SELECT * 
from Event e 
FULL OUTER JOIN ItemSelectRecord r
ON e.EventID = i.EventID;
