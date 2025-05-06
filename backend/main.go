package main

import (
	"customer-dashboard/database"
	"customer-dashboard/service"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Connect to database with GORM
	if err := database.Connect(); err != nil {
		log.Fatal(err)
	}

	// Defer closing raw DB connection
	sqlDB, err := database.DB.DB()
	if err != nil {
		log.Fatal("❌ Failed to get raw DB connection:", err)
	}
	defer sqlDB.Close()

	// Run migrations
	database.Migrate(database.DB)

	// Seed dummy data if enabled
	if os.Getenv("SEED_DATA") == "true" {
		database.CreateDummyData(database.DB)
	}

	// Initialize Fiber app
	app := fiber.New()

	// CORS Middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// API grouping
	api := app.Group("/api")

	// Auth (public routes)
	auth := api.Group("/auth")
	auth.Post("/login", service.Login)
	auth.Post("/register", service.Register)

	// Customer (protected routes)
	customers := api.Group("/customers")
	// customers := api.Group("/customers", middleware.Protected())
	customers.Get("/", service.GetCustomers)
	customers.Get("/:id", service.GetCustomerDetails)

	// Start server
	log.Println("🚀 Server running at http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
