JSON data format for each call

/api/product

{
    "Username": "test",
    "Password": "test"
}


/api/user

{
    "Username": "test",
    "Password": "test"
}

/api/user_update

-- user can update their username, password, name, and other information that we'll add

{
    "Username": "test",
    "Password": "test"
    data: {
    	"Username": "",
    	"Password": "",
    	"Name": "",
    	"ZipCode": "",
			"City": ,
			"State": ,
			"StreetAddress": ,
    }
}

/api/product updated
{
    "Username": "test",
    "Password": "test"
    data: {
    	"Sellby"
			"Qty"
    }
}

/api/product_create
-- user can create a product entry

{
    "Username": "test",
    "Password": "test"
    data: {

		"ProductName": "Baby Arugula",
		"BrandName": "GreenWise",
		"SellBy": 20210101,
		"SupplyDemand": "S",
		"Qty": 100,
		"Organic": 1

    }
}


Calls:


GETS:
- get all supply or demand
	- product, type, category, supply/demand


- see what you have
	- PK, product, type, category, supply/demand -> intermediate table

- get for a specific product -> search for product


Insert:
- changes products table, plus intermediate table


update:
- user has to look over their own stuff, and use the PK to update
IN PasswordP varchar(50), IN NameP varchar(80), IN ZipCodeP int(11), IN StreetAddress varchar(45), IN CityP varchar(70), IN StateP varchar(25)

DELETES:
- user has to look over their own stuff, and use the PK to delete
- based on primary key
