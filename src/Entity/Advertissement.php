<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AdvertissementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\DataPersister\AdvertissementDataPersister;


#[ORM\Entity(repositoryClass: AdvertissementRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['advert_read']],
    denormalizationContext: ['groups' => ['advert_write']],
    processor: AdvertissementDataPersister::class
)]
class Advertissement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['advert_read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['advert_read', 'advert_write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['advert_read'])] // Optional: pas besoin de l’envoyer
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'advertissements')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['advert_read'])] // ✅ pas dans 'advert_write'
    private ?User $creator = null;

    #[ORM\Column(length: 255)]
    #[Groups(['advert_read', 'advert_write'])]
    private ?string $title = null;

    // Getters & Setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }
}
