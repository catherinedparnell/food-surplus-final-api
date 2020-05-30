
import requests

# Author's: Utsav Jalan and Connor Quigley
# Usage: python call_api.py


# Get call
def make_get_call(url, data):
	#make get call to url
	resp = requests.get(url, json=data)
	#expecting to get a status of 200 on success

	if resp.json()['status'] != 200:
		# This means something went wrong.
		print()
		print('Something went wrong: {}'.format(resp.json()['response']))
		print()
		return

	#print data returned
	print("get succeeded")
	print()
	for employee in resp.json()['response']:
		print(employee)

	print()
	return

# Post call
def make_post_call(url, data):
	#make post call to url passing it data
	resp = requests.post(url, json=data)
	#expecting to get a status of 201 on success
	if resp.json()['status'] != 200:
		print()
		print('Something went wrong: {}'.format(resp.json()['response']))
		print()
		return

	print()
	print('post succeeded')
	print(resp.json()['response'])
	print()
	return

# Put Call
def make_put_call(url,data):
	#make post call to url passing it data

	resp = requests.put(url, json=data)

	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		print()
		print('Something went wrong: {}'.format(resp.json()['response']))
		print()
		return

	print()
	print('put succeeded')
	print(resp.json()['response'])
	print()
	return

# Delete Call
def make_delete_call(url, data):
	#make post call to url passing it data
	resp = requests.delete(url, json=data)
	#expecting to get a status of 200 on success

	if resp.json()['status'] != 200:
		print()
		print('Something went wrong: {}'.format(resp.json()['response']))
		print()
		return

	print()
	print('delete succeeded')
	print(resp.json()['response'])
	print()
	return

# Trigger option 1 for put
def trigger_put_option_1(id_input, username_input, password_input):
	employee_name_input = input("Enter inspector's updated name: ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s name")

	employee_data = \
	{"data": {
		"employee_name": str(employee_name_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)

# Trigger option 2 for put
def trigger_put_option_2(id_input, username_input, password_input):
	hire_date_input = input("Enter inspector's updated date of hire: ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s date of hire")

	employee_data = \
	{"data": {
		"hire_date": str(hire_date_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)

# Trigger option 3 for put
def trigger_put_option_3(id_input, username_input, password_input):
	admin_privilege_input = input("Enter inspector's updated admin privilege (y/n): ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s admin privilege")

	if admin_privilege_input == 'y':
			admin_privilege_input = 1
	else:
		admin_privilege_input = 0
	
	employee_data = \
	{"data": {
		"admin_privilege": str(admin_privilege_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)

# Trigger option 4 for put
def trigger_put_option_4(id_input, username_input, password_input):
	employee_username_input = input("Enter inspector's updated username: ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s username")

	employee_data = \
	{"data": {
		"employee_username": str(employee_username_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)
	return str(employee_username_input)

# Trigger option 5 for put
def trigger_put_option_5(id_input, username_input, password_input):
	employee_password_input = input("Enter inspector's updated password: ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s password")

	employee_data = \
	{"data": {
		"employee_password": str(employee_password_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)
	return str(employee_password_input)

# Trigger option 6 for put
def trigger_put_option_6(id_input, username_input, password_input):
	salary_input = input("Enter inspector's updated salary (integer): ")
		
	print("\nMaking a put call to update inspector " + str(id_input) + "'s salary")

	employee_data = \
	{"data": {
		"salary": str(salary_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_put_call('http://localhost:3000/api/employees/' + str(id_input),employee_data)


def trigger_option_1():
	username_input = input("Enter username: ")
	password_input = input("Enter password: ")

	# make a get call to get all inspectors
	print("Making a get (read) call to employees")
	employee_data = {"username": str(username_input), "password":str(password_input)}
	make_get_call('http://localhost:3000/api/employees/', employee_data)


def trigger_option_2():
	username_input = input("Enter username: ")
	password_input = input("Enter password: ")
	id_input = input("Enter Inspector's ID: ")

	print("\nMaking a get (read) call to a specific employee (id=" + str(id_input) + ")")
	employee_data = {"username": str(username_input), "password": str(password_input)}
	make_get_call('http://localhost:3000/api/employees/' + str(id_input), employee_data)


def trigger_option_3():
	username_input = input("Enter username: ")
	password_input = input("Enter password: ")
	employee_name_input = input("Enter inspector's name: ")
	hire_date_input = input("Enter date of hire (YYYYMMDD): ")			# In what format is this gonna be entered yyyymmdd?
		
	admin_privilege_input = input("Do you want this inspector to have admin privilege? (y/n): ")
	if admin_privilege_input == 'y':
			admin_privilege_input = 1
	else:
		admin_privilege_input = 0
	
	employee_username_input = input("Enter inspector's username: ")
	employee_password_input = input("Enter inspector's password: ")
	employee_salary_input = input("Enter inspector's salary (integer): ")
		
	print("\nMaking a post (create) call")

	employee_data = \
	{"data": {
		"employee_name": str(employee_name_input),
		"hire_date": str(hire_date_input),
	 	"admin_privilege": str(admin_privilege_input),
	 	"employee_username": str(employee_username_input),
	 	"employee_password": str(employee_password_input),
	  	"salary": str(employee_salary_input)
  		},

		"credentials": {
			"username": str(username_input),
		  	"password": str(password_input)
	  	}
	}
	make_post_call('http://localhost:3000/api/employees/',employee_data)


def trigger_option_4():
	username_input = input("Enter username: ")
	password_input = input("Enter password: ")
	id_input = input("Enter ID of the Inspector you wish to update: ")

	continue_task2 = True

	while continue_task2:
		print("You can do the following:\n",\
			"\t Enter 1 to update inspector name.\n"
			"\t Enter 2 to update inspector date of hire.\n"
			"\t Enter 3 to update admin privilege.\n"
			"\t Enter 4 to update inspector username.\n"
			"\t Enter 5 to update inspector password.\n"
			"\t Enter 6 to update inspector salary.\n")
			
		val2 = input("Enter option (1-6): ")
		print("You chose option " + str(val2))
		if(val2=="1"):
			trigger_put_option_1(id_input, username_input, password_input)

		elif(val2=="2"):
			trigger_put_option_2(id_input, username_input, password_input)

		elif(val2=="3"):
			trigger_put_option_3(id_input, username_input, password_input)

		elif(val2=="4"):

			username_input = trigger_put_option_4(id_input, username_input, password_input)

		elif(val2=="5"):
			password_input = trigger_put_option_5(id_input, username_input, password_input)

		elif(val2=="6"):
			trigger_put_option_6(id_input, username_input, password_input)

		continue_task2 = input("Would you like to perform another update? (y/n)")
		continue_task2 = continue_task2.lower()
		if(continue_task2 == 'n'):
			continue_task2 = False
		else:
			continue_task2 = True
	
	print("Returning back to the main menu.")


def trigger_option_5():
	username_input = input("Enter username: ")
	password_input = input("Enter password: ")
	id_input = input("Enter Inspector's ID: ")
	employee_data = {"username": str(username_input), "password":str(password_input)}
	print("\nMaking a delete call to a specific employee (id=" + str(id_input) + ")")
	make_delete_call('http://localhost:3000/api/employees/' + str(id_input), employee_data)


if __name__ == '__main__':

	continue_task = True

	while continue_task:
		print("You can do the following:\n",\
			"\t Enter 1 to read all inspectors.\n"
			"\t Enter 2 to read a specific inspector.\n"
			"\t Enter 3 to create a new inspector entry.\n"
			"\t Enter 4 to modify an existing inspector entry.\n"
			"\t Enter 5 to delete an existing inspector entry.\n"
			"\t Enter 6 to end program.\n")
		
		val = input("Enter option (1-6): ")

		if(val=="1"):
			print("You chose option " + str(val) + ": read all inspectors. You need your username and password for this action.")
			trigger_option_1()


		elif(val=="2"):
			print("You chose option " + str(val) + ": read a specific inspector. You need your username and password for this action.")
			trigger_option_2()

		elif(val=="3"):
			print("You chose option " + str(val) + ": create a new inspector entry. You need your username and password for this action.")
			trigger_option_3()

		elif(val=="4"):
			print("You chose option " + str(val) + ": modify an existing inspector entry. You need your username and password for this action.")
			trigger_option_4()

		elif(val=="5"):
			print("You chose option " + str(val) + ": delete an existing inspector entry. You need your username and password for this action.")
			trigger_option_5()
		
		elif(val=="6"):
			continue_task = False
			print("Program ended.")

