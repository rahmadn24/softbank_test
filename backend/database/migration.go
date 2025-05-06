package database

import (
	"log"

	models "customer-dashboard/model"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.Customer{},
		&models.BankAccount{},
		&models.Pocket{},
		&models.TermDeposit{},
		&models.User{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
	log.Println("✅ Migration success")
}
