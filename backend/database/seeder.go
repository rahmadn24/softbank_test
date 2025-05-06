package database

import (
	models "customer-dashboard/model"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt" // Untuk enkripsi password
	"gorm.io/gorm"
)

func CreateDummyData(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())

	names := []string{
		"John Doe", "Jane Smith", "Alice Johnson", "Bob Lee",
		"Charlie Brown", "Diana Prince", "Ethan Hunt", "Fiona Gallagher",
		"George Martin", "Hannah Baker",
	}
	emails := []string{
		"john@example.com", "jane@example.com", "alice@example.com", "bob@example.com",
		"charlie@example.com", "diana@example.com", "ethan@example.com", "fiona@example.com",
		"george@example.com", "hannah@example.com",
	}

	for i := 0; i < 10; i++ {
		// Generate a new UUID for the customer
		customerID := uuid.New()

		// Create a customer entry
		customer := models.Customer{
			ID:      customerID, // Use uuid.UUID type
			Name:    names[i],
			Email:   emails[i],
			Phone:   fmt.Sprintf("0812%06d", rand.Intn(999999)),
			Address: fmt.Sprintf("Jl. Dummy %d No.%d", rand.Intn(100), rand.Intn(200)),
		}
		db.Create(&customer)

		// Add a bank account for the customer
		bank := models.BankAccount{
			ID:            uuid.New(), // Use uuid.UUID type
			CustomerID:    customerID, // Use uuid.UUID type
			AccountName:   customer.Name,
			AccountNumber: fmt.Sprintf("0123456789%d", rand.Intn(999)),
			Type:          "savings",
			Balance:       float64(rand.Intn(10000000)),
		}
		db.Create(&bank)

		// Add a pocket for the customer
		pocket := models.Pocket{
			ID:           uuid.New(), // Use uuid.UUID type
			CustomerID:   customerID, // Use uuid.UUID type
			Name:         "Vacation Fund",
			Description:  "Saving for trip",
			Balance:      float64(rand.Intn(3000000)),
			TargetAmount: float64(rand.Intn(10000000) + 1000000),
		}
		db.Create(&pocket)

		// Add a term deposit for the customer
		start := time.Now().AddDate(0, -rand.Intn(6), 0)
		end := start.AddDate(0, 6, 0)
		term := models.TermDeposit{
			ID:           uuid.New(), // Use uuid.UUID type
			CustomerID:   customerID, // Use uuid.UUID type
			Amount:       float64(rand.Intn(20000000) + 1000000),
			InterestRate: 4.5,
			StartDate:    start,
			EndDate:      end,
			Status:       "active",
		}
		db.Create(&term)
	}

	// Seeder untuk User Admin
	adminPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}

	adminUser := models.User{
		ID:        uuid.New(),
		Email:     "admin@example.com",
		Password:  string(adminPassword),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Cek jika admin sudah ada, jika belum, tambahkan
	var existingUser models.User
	if err := db.Where("email = ?", adminUser.Email).First(&existingUser).Error; err != nil {
		// Jika user belum ada, buat user baru
		if err := db.Create(&adminUser).Error; err != nil {
			log.Fatalf("Error creating admin user: %v", err)
		} else {
			log.Println("✅ Admin user created successfully")
		}
	} else {
		log.Println("⚠️ Admin user already exists")
	}

	log.Println("✅ Dummy data inserted successfully")
}
