<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Advertissement;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class AdvertissementDataPersister implements ProcessorInterface
{
    private EntityManagerInterface $entityManager;
    private Security $security;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = []): Advertissement
    {
        if ($data instanceof Advertissement) {
            if (!$data->getCreator()) {
                $data->setCreator($this->security->getUser());
            }

            if (!$data->getCreatedAt()) {
                $data->setCreatedAt(new \DateTimeImmutable());
            }

            $this->entityManager->persist($data);
            $this->entityManager->flush();
        }

        return $data;
    }
}
