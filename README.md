# Banka
Banka is a light-weight core banking application that powers banking operation on the go. With Banka you can create an account, make deposit, see your transaction overview and much more...

[![Build Status](https://travis-ci.org/encodedBicoding/banka.svg?branch=develop)](https://travis-ci.org/encodedBicoding/banka)
[![Maintainability](https://api.codeclimate.com/v1/badges/20e5a98548ee500f38b4/maintainability)](https://codeclimate.com/github/encodedBicoding/banka/maintainability)
[![GitHub license](https://img.shields.io/github/license/encodedBicoding/banka.svg)](https://github.com/encodedBicoding/banka/blob/develop/LICENSE)


# Why Banka?
Banka aims to ease banking operations for its users. Ever wanted to do operations like create and account or check account transactions, and you 
don't want to visit any of our Banka offices? Banka App helps you do all of that, Saving you time and money.

# Features
* User (client) can sign up.
* User (client) can login.
* User (client) can create an account.
* User (client) can view account transaction history.
* User (client) can view a specific account transaction.
* Staff (cashier) can debit user (client) account.
* Staff (cashier) can credit user (client) account.
* Admin/staff can view all user accounts.
* Admin/staff can view a specific user account.
* Admin/staff can activate or deactivate an account.
* Admin/staff can delete a specific user account.
* Admin can create staff and admin user accounts

# Pivotal tracker
Track the building process of Banka on Pivotal tracker via -  [link](https://www.pivotaltracker.com/n/projects/2319930)

# Github Hosted UI
Banka is hosted free on Github [link](https://encodedbicoding.github.io/banka/UI)

# Heroku Hosted API
Banka API is currently on version 1 and is hosted on heroku [link](dominic-banka.herokuapp.com)

#### Api Endpoints
<table>
    <tr>
        <th> </th>
        <th>Homepage</th>
        <th> Login </th>
        <th> Signup </th>
        <th> Accounts </th>
    </tr>
    <tr>
        <td> GET </td>
        <td> "/" </td>
        <td> /api/v1/login </td>
        <td> - </td>
        <td> - </td>
    </tr>
    <tr>
        <td>POST</td>
        <td> - </td>
        <td>/api/v1/auth/login</td>
        <td>/api/v1/auth/signup</td>
        <td>/api/v1/:user_id/accounts</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>/api/v1/auth/admin/login</td>
        <td>/api/v1/auth/:staff_id/create</td>
        <td>/api/v1/:staff_id/transactions/:account_id/debit</td>
    </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>/api/v1/:staff_id/transactions/:account_id/credit</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>/api/v1/:staff_id/account/:account_id/credit</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>/api/v1/:staff_id/account/:account_id/credit</td>
    </tr>
     <tr>
        <td>PUT</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>/api/v1/client/:user_id/uploads</td>
    </tr>
     <tr>
        <td></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>/api/v1/staff/:staff_id/uploads</td>
    </tr>
</table>
