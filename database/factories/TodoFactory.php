<?php

namespace Database\Factories;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->optional(0.7)->paragraph(),
            'status' => fake()->randomElement(TodoStatus::cases())->value,
            'category' => fake()->randomElement(TodoCategory::cases())->value,
            'due_date' => fake()->optional(0.5)->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TodoStatus::PENDING->value,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TodoStatus::COMPLETED->value,
        ]);
    }

    public function work(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => TodoCategory::WORK->value,
        ]);
    }
}
