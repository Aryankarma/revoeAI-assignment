import type { Column, Table, TableData } from "./types";

// Mock database
const mockTables: Table[] = [
  {
    id: "1",
    name: "Employee Directory",
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/1abc123def456",
    columns: [
      { name: "Name", type: "text" },
      { name: "Email", type: "text" },
      { name: "Department", type: "text" },
      { name: "Start Date", type: "date" },
      { name: "Salary", type: "number" },
    ],
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-03-20T15:30:00Z",
  },
  {
    id: "2",
    name: "Product Inventory",
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/2xyz789abc123",
    columns: [
      { name: "Product ID", type: "text" },
      { name: "Product Name", type: "text" },
      { name: "Category", type: "text" },
      { name: "Price", type: "number" },
      { name: "Stock", type: "number" },
      { name: "Last Updated", type: "date" },
    ],
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-03-25T11:45:00Z",
  },
];


// my data 
// {
//   "id": "1",
//   "name": "Employee Directory",
//   "googleSheetUrl": "https://docs.google.com/spreadsheets/d/1abc123def456",
//   "columns": [
//       {
//           "name": "Name",
//           "type": "text"
//       },
//       {
//           "name": "Email",
//           "type": "text"
//       },
//       {
//           "name": "Department",
//           "type": "text"
//       },
//       {
//           "name": "Start Date",
//           "type": "date"
//       },
//       {
//           "name": "Salary",
//           "type": "number"
//       }
//   ],
  // "rows": [
  //     {
  //         "Name": "John Doe",
  //         "Email": "john@example.com",
  //         "Department": "Engineering",
  //         "Start Date": "2022-01-15",
  //         "Salary": 85000
  //     },
  //     {
  //         "Name": "David Miller",
  //         "Email": "david@example.com",
  //         "Department": "Product",
  //         "Start Date": "2021-04-12",
  //         "Salary": 95000
  //     },
  //     {
  //         "Name": "Jennifer Taylor",
  //         "Email": "jennifer@example.com",
  //         "Department": "Engineering",
  //         "Start Date": "2022-05-30",
  //         "Salary": 87000
  //     },
  // ],
//   "lastUpdated": "2025-03-08T13:39:31.825Z"
//   "createdAt": "2023-01-15T12:00:00Z",
//   "updatedAt": "2023-03-20T15:30:00Z"
// }

// Mock data for tables
const mockTableData: Record<string, TableData> = {
  "1": {
    rows: [
      {
        Name: "John Doe",
        Email: "john@example.com",
        Department: "Engineering",
        "Start Date": "2022-01-15",
        Salary: 85000,
      },
      {
        Name: "Jane Smith",
        Email: "jane@example.com",
        Department: "Marketing",
        "Start Date": "2021-06-10",
        Salary: 78000,
      },
      {
        Name: "Michael Johnson",
        Email: "michael@example.com",
        Department: "Sales",
        "Start Date": "2022-03-22",
        Salary: 92000,
      },
      {
        Name: "Emily Davis",
        Email: "emily@example.com",
        Department: "HR",
        "Start Date": "2020-11-05",
        Salary: 75000,
      },
      {
        Name: "Robert Wilson",
        Email: "robert@example.com",
        Department: "Engineering",
        "Start Date": "2021-09-18",
        Salary: 88000,
      },
      {
        Name: "Sarah Brown",
        Email: "sarah@example.com",
        Department: "Design",
        "Start Date": "2022-02-28",
        Salary: 82000,
      },
      {
        Name: "David Miller",
        Email: "david@example.com",
        Department: "Product",
        "Start Date": "2021-04-12",
        Salary: 95000,
      },
      {
        Name: "Jennifer Taylor",
        Email: "jennifer@example.com",
        Department: "Engineering",
        "Start Date": "2022-05-30",
        Salary: 87000,
      },
      {
        Name: "James Anderson",
        Email: "james@example.com",
        Department: "Marketing",
        "Start Date": "2021-08-15",
        Salary: 79000,
      },
      {
        Name: "Lisa Thomas",
        Email: "lisa@example.com",
        Department: "Sales",
        "Start Date": "2022-01-10",
        Salary: 91000,
      },
      {
        Name: "Daniel Jackson",
        Email: "daniel@example.com",
        Department: "Engineering",
        "Start Date": "2021-03-05",
        Salary: 86000,
      },
      {
        Name: "Michelle White",
        Email: "michelle@example.com",
        Department: "HR",
        "Start Date": "2022-04-20",
        Salary: 76000,
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  "2": {
    rows: [
      {
        "Product ID": "P001",
        "Product Name": "Laptop Pro",
        Category: "Electronics",
        Price: 1299.99,
        Stock: 45,
        "Last Updated": "2023-03-10",
      },
      {
        "Product ID": "P002",
        "Product Name": "Smartphone X",
        Category: "Electronics",
        Price: 899.99,
        Stock: 78,
        "Last Updated": "2023-03-15",
      },
      {
        "Product ID": "P003",
        "Product Name": "Wireless Headphones",
        Category: "Audio",
        Price: 199.99,
        Stock: 120,
        "Last Updated": "2023-03-12",
      },
      {
        "Product ID": "P004",
        "Product Name": "Ergonomic Chair",
        Category: "Furniture",
        Price: 249.99,
        Stock: 32,
        "Last Updated": "2023-03-08",
      },
      {
        "Product ID": "P005",
        "Product Name": "Standing Desk",
        Category: "Furniture",
        Price: 399.99,
        Stock: 18,
        "Last Updated": "2023-03-20",
      },
      {
        "Product ID": "P006",
        "Product Name": "Wireless Mouse",
        Category: "Accessories",
        Price: 49.99,
        Stock: 95,
        "Last Updated": "2023-03-18",
      },
      {
        "Product ID": "P007",
        "Product Name": "Mechanical Keyboard",
        Category: "Accessories",
        Price: 129.99,
        Stock: 62,
        "Last Updated": "2023-03-14",
      },
      {
        "Product ID": "P008",
        "Product Name": "4K Monitor",
        Category: "Electronics",
        Price: 349.99,
        Stock: 27,
        "Last Updated": "2023-03-22",
      },
      {
        "Product ID": "P009",
        "Product Name": "Wireless Charger",
        Category: "Accessories",
        Price: 39.99,
        Stock: 110,
        "Last Updated": "2023-03-19",
      },
      {
        "Product ID": "P010",
        "Product Name": "External SSD",
        Category: "Storage",
        Price: 159.99,
        Stock: 55,
        "Last Updated": "2023-03-17",
      },
      {
        "Product ID": "P011",
        "Product Name": "Webcam HD",
        Category: "Electronics",
        Price: 79.99,
        Stock: 48,
        "Last Updated": "2023-03-21",
      },
      {
        "Product ID": "P012",
        "Product Name": "USB-C Hub",
        Category: "Accessories",
        Price: 69.99,
        Stock: 83,
        "Last Updated": "2023-03-16",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  // "3": {
  //     "range": "'Form responses 1'!A1:T198",
  //     "majorDimension": "ROWS",
  //     "values": [
  //         [
  //             "Timestamp",
  //             "What name do you go by ?",
  //             "Result",
  //             "Where can we drop you an Email ? ",
  //             "Phone no. ?",
  //             "Institute, Course, Branch (e.g. IAC, B.tech, CSE) ?",
  //             "Year ?",
  //             "Which Domain you are most passionate about?",
  //             "Showcase your skill set in the selected domain.",
  //             "Tell us the story of your recent project and what problem it solved (if any) ?",
  //             "Work Sample (if any, please attach it'll help us evaluate fairly)",
  //             "Your Social media handle (Instagram, linkedIn or any other)",
  //             "Tell us how joining GDG allings with your personal and technical goals?",
  //             "Is there anything we missed that you'd like to share with us ?",
  //             "Status",
  //             "Ststus",
  //             "Column 16",
  //             "Shorlist"
  //         ],
  //         [
  //             "19/09/2024 15:44:49",
  //             "Chetan patidar ",
  //             "",
  //             "chetanptdr49@gmail.com",
  //             "9329997363",
  //             "B.tech /CSE",
  //             "1st",
  //             "Web Development",
  //             "Web development ",
  //             "",
  //             "",
  //             "",
  //             "It is good for my career ",
  //             "Nothing "
  //         ],
  //         [
  //             "19/09/2024 15:54:16",
  //             "Gaurav Dehariya ",
  //             "",
  //             "gauravdehariya55@gmail.com",
  //             "87676 36209 ",
  //             "IAC, Btech, CST",
  //             "2nd",
  //             "AI/ML",
  //             "Little bit knowledge of Generative AI",
  //             "Not yet",
  //             "",
  //             "INSTAGRAM:   gauravdehariya   ,    LinkedIn: Gaurav Dehariya",
  //             "Networking GDG provides a platform to\nconnect with like-minded individuals,\nindustry experts, and thought leaders,\nexpanding my professional network.\n\nProject Development Collaborating with\nfellow members on projects helps me\napply theoretical knowledge to real-world\nproblems.",
  //             "Liked to be creative \nGenerally edit a video during free time.."
  //         ],
  //         [
  //             "19/09/2024 15:56:11",
  //             "Anushka Singh ",
  //             "",
  //             "a7415876280@gmail.com",
  //             "7909945664",
  //             "IAC,Diploma,CSE",
  //             "2nd",
  //             "Cybersecurity",
  //             "C,C++, python ",
  //             "No",
  //             "",
  //             "Anu_rajput653",
  //             "Want to become cybersecurity officer",
  //             "No"
  //         ],
  //         [
  //             "19/09/2024 15:56:30",
  //             "Tanmay singh rajput",
  //             "core",
  //             "Tanmaysinghrajput1012@gmail.com",
  //             "9575770023",
  //             "IAC,B.tech,CSE",
  //             "3rd",
  //             "Graphic designer",
  //             "Design Skills:\n1.\tLogos and branding\n2.\tPrint materials\n3.\tDigital graphics (social media, web banners)\nSoftware Proficiency:\n1.\tAdobe Creative Suite (Photoshop, Illustrator, InDesign)\n2.\tSketch\n3.\tFigma\n4.\tCanva",
  //             "I am making a poster for a company which deals in online market.",
  //             "https://drive.google.com/open?id=1_LTJjAvtZnLoelLOfkHmEj7ATIVTr0wd, https://drive.google.com/open?id=1u2Ue2adJdBIRnSPe-TGisR2G8HHSYvET",
  //             "",
  //             "Personal Goals:\n1.\tNetworking: Connect with like-minded professionals, build relationships, and expand your network.\n2.\tCommunity involvement: Contribute to organizing events, mentorship, and knowledge sharing.\n3.\tPersonal growth: Develop soft skills, leadership, and communication skills.\n4.\tAccess to resources: Utilize GDG's resources, including workshops, webinars, and online courses.\nTechnical Goals:\n1.\tSkill development: Enhance expertise in Google technologies (e.g., Android, Cloud, Machine Learning).\n2.\tStay updated: Stay current with industry trends, best practices, and new technologies.\n3.\tCollaboration: Work on projects, participate in hackathons, and co-create innovative solutions.\n4.\tCareer advancement: Showcase skills, demonstrate expertise, and increase visibility.\nAlignment:\n1.\tEnhance resume: Participation demonstrates commitment to professional growth.\n2.\tMentorship: Receive guidance from experienced professionals.\n3.\tAccess to job opportunities: Connect with potential employers and startups.\n4.\tPersonal projects: Get support and resources for personal projects.",
  //             "No, thank you ! "
  //         ],
  //         [
  //             "19/09/2024 16:05:29",
  //             "Saurabh Borgaonkar ",
  //             "",
  //             "saurabhborgaonkar55@gmail.com",
  //             "7498059665",
  //             "IAC,B.tech,CSE",
  //             "2nd",
  //             "Web Development",
  //             "Learning HTMl,CSS",
  //             "Now I am learning ",
  //             "",
  //             "Linkedin ",
  //             "Joining for personal ",
  //             "No"
  //         ],
  //         [
  //             "19/09/2024 16:06:16",
  //             "Nisha Rawat",
  //             "",
  //             "nisharawat1800@gmail.com",
  //             "8982924799",
  //             "IAC,B.tech,CSE",
  //             "3rd",
  //             "App development ",
  //             "-",
  //             "None",
  //             "",
  //             "",
  //             "I can be able to interact with programmers and people who are interested in this field",
  //             "No"
  //         ],
  //         [
  //             "19/09/2024 16:06:47",
  //             "Anish patel",
  //             "",
  //             "patelanish7872@gmail.com",
  //             "6201423634",
  //             "IAC, B.tech, CSE",
  //             "1st",
  //             "AI/ML",
  //             "I know how to use the chat GPT",
  //             "",
  //             "",
  //             "",
  //             "As a first year CSE student, i am eager to expand my understanding of the various domains in computer science. joining GRG will provide me with exposure to real world applications and projects , allowing me to apply what i learn in the classroom in practical sitting. it will help me build important soft skills like team working ,communication and problem solving.",
  //             "you will love to know that i am good in team management. I was in the group of head boys in my school."
  //         ],
  //         [
  //             "19/09/2024 16:57:50",
  //             "Muskan wagh ",
  //             "",
  //             "muskanwagh1608@gmail.com",
  //             "6266874749",
  //             "IAC,b.tech, CSE ",
  //             "2nd",
  //             "Web Development",
  //             "I'm interested in Web development because from my perspective I'm eager to learn more and explore the technology ",
  //             "",
  //             "",
  //             "M",
  //             "I think because of joining gdg group it will help me to enhance my productivity and skill ",
  //             "I'm also interested in event management domain "
  //         ],
  //         [
  //             "19/09/2024 21:22:20",
  //             "Yashi Lakhera ",
  //             "",
  //             "yashilakhera16@gmail.com",
  //             "8839429788",
  //             "IAC, B.tech CSE ",
  //             "3rd",
  //             "Web Development",
  //             ". ",
  //             ".",
  //             "",
  //             "https://www.linkedin.com/in/yashi-lakhera-1b4969278",
  //             "It enhances my skills which I learn there with team members. ",
  //             "NA"
  //         ],
  //         [
  //             "19/09/2024 22:34:07",
  //             "Lakshya soni",
  //             "",
  //             "lsoni2407@gmail.com",
  //             "9009976910",
  //             "IAC, B.tech, CSE",
  //             "3rd",
  //             "Cybersecurity",
  //             "Fundamentals of cyber security, \ncyber security essentials, \nComputer networking,\nCTFs,\nXSS\nPentesting",
  //             "I was currently working on project related to Parsing amd web scrapping. Recently i have completed my internship at Hacktify cyber security as a penetration tester.",
  //             "https://drive.google.com/open?id=1aMXhx2ppHIvkmAu1ayn82axI5tkCCBj4",
  //             "https://www.linkedin.com/in/lakshya-soni-383161235",
  //             "Joining GDG helps me in building more strong professional network, developing of my soft skills, career advancement and personality growth. Joinig this community helps me to learn and enhance my skills in my domain.",
  //             "Currently i was also doing some certification courses by Google and cisco which further helps me in my domain."
  //         ]
  //     ]
  // }
};

// Mock API functions
export async function mockFetchTables(): Promise<Table[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTables);
    }, 500);
  });
}

export async function mockFetchTableDetails(id: string): Promise<Table> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const table = mockTables.find((t) => t.id === id);
      if (table) {
        resolve(table);
      } else {
        reject(new Error("Table not found"));
      }
    }, 500);
  });
}

export async function mockFetchTableData(id: string): Promise<TableData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockTableData[id];
      if (data) {
        // Add some randomness to simulate data changes
        if (Math.random() > 0.7) {
          if (id === "1") {
            const names = ["Alex", "Sam", "Jordan", "Taylor", "Casey"];
            const departments = [
              "Engineering",
              "Marketing",
              "Sales",
              "HR",
              "Design",
            ];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomDept =
              departments[Math.floor(Math.random() * departments.length)];
            const randomSalary = 70000 + Math.floor(Math.random() * 30000);

            data.rows.push({
              Name: `${randomName} ${Math.floor(Math.random() * 1000)}`,
              Email: `${randomName.toLowerCase()}@example.com`,
              Department: randomDept,
              "Start Date": new Date().toISOString().split("T")[0],
              Salary: randomSalary,
            });
          } else if (id === "2") {
            const randomStock = Math.floor(Math.random() * 20);
            // Update a random product's stock
            const randomIndex = Math.floor(Math.random() * data.rows.length);
            data.rows[randomIndex].Stock = randomStock;
            data.rows[randomIndex]["Last Updated"] = new Date()
              .toISOString()
              .split("T")[0];
          }

          data.lastUpdated = new Date().toISOString();
        }

        resolve(data);
      } else {
        reject(new Error("Table data not found"));
      }
    }, 500);
  });
}

export async function mockCreateTable(tableData: {
  name: string;
  googleSheetUrl: string;
  columns: Column[];
}): Promise<Table> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTable: Table = {
        id: (mockTables.length + 1).toString(),
        name: tableData.name,
        googleSheetUrl: tableData.googleSheetUrl,
        columns: tableData.columns,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockTables.push(newTable);

      // Create mock data for the new table
      mockTableData[newTable.id] = {
        rows: generateMockData(tableData.columns, 15),
        lastUpdated: new Date().toISOString(),
      };

      resolve(newTable);
    }, 1000);
  });
}

// Helper function to generate mock data based on column types
function generateMockData(
  columns: Column[],
  count: number
): Record<string, any>[] {
  const rows: Record<string, any>[] = [];

  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {};

    columns.forEach((column) => {
      if (column.type === "text") {
        row[column.name] = `Sample ${column.name} ${i + 1}`;
      } else if (column.type === "number") {
        row[column.name] = Math.floor(Math.random() * 1000);
      } else if (column.type === "date") {
        // Random date in the last year
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        row[column.name] = date.toISOString().split("T")[0];
      }
    });

    rows.push(row);
  }

  return rows;
}
