<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FilmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@sewafilm.local'],
            ['name' => 'Super Admin', 'password' => bcrypt('password'), 'role' => 'admin']
        );

        $sineasUser = \App\Models\User::firstOrCreate(
            ['email' => 'sineas@sewafilm.local'],
            ['name' => 'Studio Sineas', 'password' => bcrypt('password'), 'role' => 'sineas']
        );

        $filmmaker = \App\Models\Filmmaker::firstOrCreate(
            ['user_id' => $sineasUser->id],
            ['name' => 'Studio Sineas Production', 'bio' => 'A great local studio.']
        );

        $films = [
            [
                'title' => 'Elio',
                'genre' => 'Adventure',
                'description' => 'Elio, an underdog with an active imagination, finds himself inadvertently beamed up to the Communiverse, an interplanetary organization with representatives from galaxies far and wide.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/yKjfHWijG1g7s4e4I809x3UioF.jpg',
                'duration_minutes' => 120,
                'rental_price' => 15000,
                'is_published' => true,
            ],
            [
                'title' => 'The Electric State',
                'genre' => 'Sci-Fi',
                'description' => 'An orphaned teenager traverses the American West with a sweet but mysterious robot and an eccentric drifter in search of her younger brother.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/5k7mZlO4YQeEqWlqRk2z0u5wZ8q.jpg',
                'duration_minutes' => 110,
                'rental_price' => 20000,
                'is_published' => true,
            ],
            [
                'title' => 'Interstellar',
                'genre' => 'Sci-Fi',
                'description' => 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                'duration_minutes' => 169,
                'rental_price' => 25000,
                'is_published' => true,
            ],
            [
                'title' => 'Inception',
                'genre' => 'Action',
                'description' => 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
                'duration_minutes' => 148,
                'rental_price' => 25000,
                'is_published' => true,
            ],
            [
                'title' => 'Frankenstein',
                'genre' => 'Horror',
                'description' => 'A scientist creates a living creature from body parts, but soon realizes his creation is a monster.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/6f5B1M1a0j9gQXzR8Fh3zQW1Q2P.jpg', // random tmdb like poster
                'duration_minutes' => 105,
                'rental_price' => 10000,
                'is_published' => true,
            ],
            [
                'title' => 'Superman',
                'genre' => 'Action',
                'description' => 'Superman embarks on a journey to save the world.',
                'poster_path' => 'https://image.tmdb.org/t/p/w500/q2Z1vK9H2Y2N0V8h5D2Z1vK9H2Y.jpg',
                'duration_minutes' => 143,
                'rental_price' => 30000,
                'is_published' => true,
            ]
        ];

        foreach ($films as $filmData) {
            $film = \App\Models\Film::firstOrCreate(
                ['title' => $filmData['title']],
                array_merge($filmData, [
                    'slug' => \Illuminate\Support\Str::slug($filmData['title']),
                    'filmmaker_id' => $filmmaker->id,
                ])
            );

            // Add some dummy reviews for rating display
            \App\Models\Review::firstOrCreate(
                ['film_id' => $film->id, 'user_id' => $admin->id],
                ['rating' => rand(3, 5), 'comment' => 'Great movie!']
            );
        }
    }
}
