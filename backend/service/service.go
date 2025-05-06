package service

import (
	"customer-dashboard/database"
	models "customer-dashboard/model"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Parse the input body
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Retrieve user from the database using GORM
	var user models.User
	err := database.DB.Where("email = ?", input.Email).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Compare password with hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign the token
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
	}

	// Return the token and user info
	return c.JSON(fiber.Map{
		"token": tokenString,
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
		},
	})
}

func Register(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Parse the input body
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not hash password"})
	}

	// Create the user in the database using GORM
	user := models.User{
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	err = database.DB.Create(&user).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create user"})
	}

	// Return the newly created user
	return c.Status(201).JSON(fiber.Map{
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
		},
	})
}

func GetCustomers(c *fiber.Ctx) error {
	search := c.Query("search", "")
	var customers []models.Customer

	// Fetch customers using GORM with a search query
	err := database.DB.Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%").
		Order("created_at DESC").
		Find(&customers).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(customers)
}

func GetCustomerDetails(c *fiber.Ctx) error {
	id := c.Params("id")

	var customer models.Customer
	err := database.DB.First(&customer, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Customer not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Get bank accounts
	var bankAccounts []models.BankAccount
	err = database.DB.Where("customer_id = ?", id).Find(&bankAccounts).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Get pockets
	var pockets []models.Pocket
	err = database.DB.Where("customer_id = ?", id).Find(&pockets).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Get term deposits
	var termDeposits []models.TermDeposit
	err = database.DB.Where("customer_id = ?", id).Find(&termDeposits).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(fiber.Map{
		"customer":      customer,
		"bank_accounts": bankAccounts,
		"pockets":       pockets,
		"term_deposits": termDeposits,
	})
}
