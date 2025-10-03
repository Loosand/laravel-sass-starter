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
        $titles = [
            'Complete project documentation',
            'Review code changes',
            'Fix bug in authentication system',
            'Update user interface design',
            'Implement search functionality',
            'Optimize database queries',
            'Write unit tests',
            'Deploy to production server',
            'Schedule team meeting',
            'Prepare presentation slides',
            'Research new technologies',
            'Update dependencies',
            'Backup database',
            'Monitor system performance',
            'Create user manual',
            'Test mobile responsiveness',
            'Configure CI/CD pipeline',
            'Refactor legacy code',
            'Setup monitoring alerts',
            'Plan sprint activities',
            'Buy groceries',
            'Call dentist for appointment',
            'Pay electricity bill',
            'Exercise at gym',
            'Read technical book',
            'Learn new programming language',
            'Organize workspace',
            'Plan weekend trip',
            'Cook dinner',
            'Walk the dog',
        ];

        $descriptions = [
            'This task requires careful attention to detail and thorough testing.',
            'Make sure to follow the coding standards and best practices.',
            'Coordinate with the team members for this task.',
            'This is a high priority task that needs immediate attention.',
            'Consider the performance implications of this change.',
            'Document the process for future reference.',
            'Test thoroughly before deploying to production.',
            'This task might take longer than expected.',
            'Review the requirements carefully before starting.',
            'Make sure to backup data before making changes.',
        ];

        return [
            'title' => fake()->randomElement($titles),
            'description' => fake()->optional(0.7)->randomElement($descriptions),
            'status' => fake()->randomElement(TodoStatus::cases())->value,
            'category' => fake()->randomElement(TodoCategory::cases())->value,
            'due_date' => fake()->optional(0.5)->dateTimeBetween('now', '+30 days')?->format('Y-m-d'),
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
