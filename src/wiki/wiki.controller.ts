import { Controller } from "@nestjs/common";
import { WikiService } from "./wiki.service";

@Controller("wiki")
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}
}
