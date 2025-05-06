package models

import (
	"time"

	"github.com/google/uuid"
)

type Customer struct {
	ID           uuid.UUID     `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name         string        `json:"name"`
	Email        string        `gorm:"uniqueIndex" json:"email"`
	Phone        string        `json:"phone"`
	Address      string        `json:"address"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
	BankAccounts []BankAccount `json:"bank_accounts"`
	Pockets      []Pocket      `json:"pockets"`
	TermDeposits []TermDeposit `json:"term_deposits"`
}

type BankAccount struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CustomerID    uuid.UUID `gorm:"type:uuid;index" json:"customer_id"`
	AccountName   string    `json:"account_name"`
	AccountNumber string    `json:"account_number"`
	Type          string    `json:"type"`
	Balance       float64   `gorm:"type:decimal(12,2)" json:"balance"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Pocket struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CustomerID   uuid.UUID `gorm:"type:uuid;index" json:"customer_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Balance      float64   `gorm:"type:decimal(12,2)" json:"balance"`
	TargetAmount float64   `gorm:"type:decimal(12,2)" json:"target_amount"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type TermDeposit struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CustomerID   uuid.UUID `gorm:"type:uuid;index" json:"customer_id"`
	Amount       float64   `gorm:"type:decimal(12,2)" json:"amount"`
	InterestRate float64   `gorm:"type:decimal(5,2)" json:"interest_rate"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
