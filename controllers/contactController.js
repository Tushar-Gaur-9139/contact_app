const { query, body, param } = require("express-validator");
const db = require("../config/db");

exports.getContacts = [
  // Validation rules...
  
  async (req, res) => {
    const {
      page = 1,
      limit = 10,
      sort = "asc",
      columns = [],
      ...filters
    } = req.query;

    const validSort = ["asc", "desc"].includes(sort.toLowerCase())
      ? sort.toLowerCase()
      : "asc";

    let query = "SELECT * FROM contact WHERE 1=1";
    let queryParams = [];

    const filterFields = [
      "id",
      "FirstName",
      "LastName",
      "NickName",
      "Email",
      "Phone",
      "WorkAddress",
      "Address",
      "Groups",
      "Relationship",
      "Notes",
      "Websites",
    ];

    filterFields.forEach((field) => {
      if (filters[field]) {
        query += ` AND ${field} LIKE ?`;
        queryParams.push(`%${filters[field]}%`);
      }
    });

    const validSortByFields = [
      "id",
      "FirstName",
      "LastName",
      "NickName",
      "Email",
      "Phone",
      "WorkAddress",
      "Address",
      "Groups",
      "Relationship",
      "Notes",
      "Websites",
    ];
    const { sortBy = "Email" } = req.query;
    const validSortBy = validSortByFields.includes(sortBy) ? sortBy : "Email";

    query += ` ORDER BY ${validSortBy} ${validSort.toUpperCase()} LIMIT ?, ?`;

    queryParams.push((page - 1) * limit, parseInt(limit));

    // Ensure that 'id' is always included in the columns
    const selectedColumns = columns.length ? [...columns, 'id'] : [...filterFields, 'id'];
    const selectedColumnsQuery = selectedColumns
      .map((col) => {
        if (col === "Groups") {
          return "`Groups`"; // Keep quotes for reserved words if needed
        }
        return col;
      })
      .join(", ");

    query = query.replace("SELECT *", `SELECT ${selectedColumnsQuery}`);

    console.log("Final Query:", query);
    console.log("Query Params:", queryParams);

    try {
      const [contacts] = await db.query(query, queryParams);
      const [totalResult] = await db.query(
        "SELECT COUNT(*) AS totalContacts FROM contact"
      );

      const totalContacts = totalResult[0]?.totalContacts || 0;
      const totalPages = Math.ceil(totalContacts / limit);

      console.log("Contacts before mapping:", contacts);

      // If the 'id' is included in the query result, it should now be part of the 'contact'
      const contactsWithId = contacts.map(contact => {
        console.log("Contact ID:", contact.id);  // Log the contact id for debugging
        return {
          ...contact,
          id: contact.id,  // Ensure `id` is included (should be there now)
        };
      });

      console.log("Contacts with id included:", contactsWithId);

      res.json({
        contacts: contactsWithId,
        currentPage: parseInt(page),
        totalPages,
        totalContacts,
      });
    } catch (error) {
      console.error("Error fetching contacts:", error.message || error);
      res.status(500).send({ message: "Failed to fetch contacts", error: error.message });
    }
  },
];



exports.addContact = [
  async (req, res) => {
    const {
      FirstName,
      LastName,
      NickName,
      Email,
      Phone,
      WorkAddress,
      Address,
      Groups,
      Relationship,
      Notes,
      Websites,
    } = req.body;

    if (
      !FirstName ||
      !LastName ||
      !NickName ||
      !Email ||
      !Phone ||
      !WorkAddress ||
      !Address ||
      !Groups ||
      !Websites ||
      !Relationship ||
      !Notes
    ) {
      return res
        .status(400)
        .send({
          message:
            "First Name, Last Name, Email, NickName, WorkAddress, Address, Groups, Websites, Phone, Notes are required",
        });
    }

    if (!/\S+@\S+\.\S+/.test(Email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    if (!/^\d{10}$/.test(Phone)) {
      return res
        .status(400)
        .send({ message: "Phone number must be 10 digits" });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO contact 
        (FirstName, LastName, NickName, Email, Phone, WorkAddress, Address, \`Groups\`, Relationship, Notes, Websites) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          FirstName,
          LastName,
          NickName,
          Email,
          Phone,
          WorkAddress,
          Address,
          Groups,
          Relationship,
          Notes,
          Websites,
        ]
      );

      res
        .status(201)
        .send({ message: "Contact added successfully", id: result.insertId });
    } catch (error) {
      console.error("Error adding contact:", error.message || error);
      res
        .status(500)
        .send({ message: "Failed to add contact", error: error.message });
    }
  },
];

exports.deleteContact = [
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),

  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.query("DELETE FROM contact WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).send("Contact not found");
      }

      res.status(200).send({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact:", error.message || error);
      res
        .status(500)
        .send({ message: "Failed to delete contact", error: error.message });
    }
  },
];

exports.updateContact = [
  async (req, res) => {
    const { Id } = req.params;
    const {
      FirstName,
      LastName,
      NickName,
      Email,
      Phone,
      WorkAddress,
      Address,
      Groups,
      Relationship,
      Notes,
      Websites,
    } = req.body;

    try {
      const [result] = await db.query(
        `UPDATE contact SET 
          FirstName = ?, LastName = ?, NickName = ?, Email = ?, Phone = ?, WorkAddress = ?, 
          Address = ?, \`Groups\` = ?, Relationship = ?, Notes = ?, Websites = ? 
          WHERE Id = ?`,
        [
          FirstName,
          LastName,
          NickName,
          Email,
          Phone,
          WorkAddress,
          Address,
          Groups,
          Relationship,
          Notes,
          Websites,
          Id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).send("Contact not found");
      }

      res.status(200).send({ message: "Contact updated successfully" });
    } catch (error) {
      console.error("Error updating contact:", error.message || error);
      res
        .status(500)
        .send({ message: "Failed to update contact", error: error.message });
    }
  },
];

exports.getSingleContact = [
  param("Id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),

  async (req, res) => {
    const { Id } = req.params;

    try {
      const [result] = await db.query("SELECT * FROM contact WHERE Id = ?", [
        Id,
      ]);

      if (result.length === 0) {
        return res.status(404).send("Contact not found");
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error("Error fetching contact:", error.message || error);
      res
        .status(500)
        .send({ message: "Failed to fetch contact", error: error.message });
    }
  },
];
