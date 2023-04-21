<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Filter\JsonFilter;
use App\Repository\UserRepository;
use App\State\UserMeStateProvider;
use App\State\UserProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidBinaryType;
use Ramsey\Uuid\Doctrine\UuidV7Generator;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;



#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/users/me',
            security: 'is_granted("ROLE_USER")',
            name: '_api_/users/me',
            provider: UserMeStateProvider::class
        ),
        new Get(),
        new GetCollection(),
        new Post(),
        new Post(
            uriTemplate: '/register',
            processor: UserProcessor::class,

        )
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['firstname' => 'ipartial'])]
#[ApiFilter(SearchFilter::class, properties: ['lastname' => 'ipartial'])]
#[ApiFilter(JsonFilter::class, properties: ['roles' => ['strategy' => 'exact']  ])]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User  implements UserInterface, PasswordAuthenticatedUserInterface, JWTUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: UuidBinaryType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidV7Generator::class)]
    private $id;
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'json', options: ['jsonb' => true])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lastname = null;

    #[ORM\ManyToOne(targetEntity: UserStatus::class, cascade: ['persist', 'remove'],inversedBy: "users")]
    private $status;

    #[ORM\Column(type: Types::STRING, nullable: true, length: 8000 )]
    private $avatar = null;

    public function getId(): string
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * Creates a new instance from a given JWT payload.
     *
     * @param string $username
     *
     * @return JWTUserInterface
     */
    public static function createFromPayload($username, array $payload)
    {
        return new self(
            $username,
            $payload['roles']
        );
    }

    /**
     * @return string[]
     */
    public function __construct($email, array $roles = array())
    {
        $this->email = $email;
        $this->roles = $roles;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getAvatar(): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'avatar');
        file_put_contents($tempFile, $this->avatar);
        $tempFile = new File($tempFile);
        $tempFile->getMimeType();

        return $this->avatar;
    }

    public function setAvatar( $avatar): self
    {
        $this->avatar = $avatar;


        return $this;
    }



}
